<?php

namespace App\Tests\Functional\APIPlatform;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Product;
use App\Factory\ProductFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class ProductFunctionalTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;

    public function testGetCollection(): void
    {
        // Create 10 Products using our factory
        ProductFactory::createMany(10);
    
        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = static::createClient()->request('GET', '/api/products');

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/api/contexts/Product',
            '@id' => '/api/products',
            '@type' => 'Collection',
            'totalItems' => 10
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(10, $response->toArray()['member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(Product::class);
    }

    public function testCreateProduct(): void
    {
        $response = static::createClient()->request('POST', 'api/products', [
            'headers' => [
                'Content-Type'  => 'application/ld+json',
            ],
            'json' => [
                "code" => "f230fh0g3",
                "name" => "Bamboo Watch",
                "description" => "Product Description",
                "image" => "bamboo-watch.jpg",
                "price" => 65,
                "quantity" => 40,
                "category" => "Accessories",
                "createdAt" => 1718114215761,
                "updatedAt" => 1718114215761,
                "shellId" => 15,
                "internalReference" => "REF-123-456",
                "inventoryStatus" => "INSTOCK",
                "rating" => 5
        ]]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            'code' => 'f230fh0g3',
            'name' => 'Bamboo Watch',
            'quantity' => 40,
            'price' => 65,
        ]);

        $this->assertMatchesResourceItemJsonSchema(Product::class);
    }

    public function testCreateInvalidProduct(): void
    {
        $response = static::createClient()->request('POST', 'api/products', [
            'headers' => [
                'Content-Type'  => 'application/ld+json',
            ],
            'json' => [
                "description" => "Product Description",
                "image" => "bamboo-watch.jpg",
                "price" => 65,
                "quantity" => 40,
                "category" => "Accessories",
                "createdAt" => 1718114215761,
                "updatedAt" => 1718114215761,
                "shellId" => 15,
                "internalReference" => "REF-123-456",
                "inventoryStatus" => "INSTOCK",
                "rating" => 5
        ]]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/problem+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/api/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'status' => 422,
            "violations" => [
                [
                    "propertyPath" => "name",
                    "message" => "This value should not be blank.",
                ]
            ]
        ]);
    }

    public function testUpdateProduct(): void
    {
        // Only create the Product we need with a given code
        ProductFactory::createOne(['code' => 'nvklal433']);
    
        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(Product::class, ['code' => 'nvklal433']);

        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                "name" => "Updated Bamboo Watch",
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]           
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            "code" => "nvklal433",
            "name" => "Updated Bamboo Watch",
        ]);
        $this->assertMatchesResourceItemJsonSchema(Product::class);
    }

    public function testUpdateProductNotFound() :void
    {
        $client = static::createClient();

        // Use the PATCH method here to do a partial update
        $client->request('PATCH', 'api/products/abcd', [
            'json' => [
                "name" => "Updated Bamboo Watch",
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]           
        ]);

        $this->assertResponseHeaderSame('content-type', 'application/problem+json; charset=utf-8');
        // Assert that the response status code is 404
        $this->assertResponseStatusCodeSame(404);
        $this->assertJsonContains([
            "@context" => "/api/contexts/Error",
            '@id' => "/api/errors/404",
            "title" => "An error occurred",
            "detail" => "Produit introuvable",
            "status" => 404,
            "description" => "Produit introuvable"
        ]);
    }

    public function testDeleteProduct(): void
    {
        // Only create the Product we need with a given code
        ProductFactory::createOne(['code' => 'nvklal433']);

        $client = static::createClient();
        $iri = $this->findIriBy(Product::class, ['code' => 'nvklal433']);

        $client->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Product::class)->findOneBy(['code' => 'nvklal433'])
        );
    }
}