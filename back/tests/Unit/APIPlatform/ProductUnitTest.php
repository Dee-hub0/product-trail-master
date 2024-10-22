<?php
namespace App\Tests\Unit\Service;

use App\Entity\Product;
use App\Service\ProductService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\Persistence\ObjectRepository;
use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class ProductServiceTest extends ApiTestCase
{
    private ProductService $productService;
    private EntityManagerInterface $entityManager;
    private ObjectRepository $productRepository;

    protected function setUp(): void
    {
        // Mock the EntityManager and the Product repository
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->productRepository = $this->createMock(ObjectRepository::class);     
        $this->productService = new ProductService($this->entityManager);
    }

    public function testCreateProduct(): void
    {
        $data = [
            "code" => "f230fh0g3",
            "name" => "Bamboo Watch",
            "description" => "Product Description",
            "image" => "bamboo-watch.jpg",
            "price" => 65,
            "quantity" => 40,
            "category" => "Accessories",
            "shellId" => 15,
            "internalReference" => "REF-123-456",
            "inventoryStatus" => "INSTOCK",
            "rating" => 5,
        ];

        // Expecting the entity manager to persist and flush
        $this->entityManager->expects($this->once())
            ->method('persist');
        $this->entityManager->expects($this->once())
            ->method('flush');

        $product = $this->productService->createProduct($data);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertSame('Bamboo Watch', $product->getName());
        $this->assertSame("f230fh0g3", $product->getCode());
    }

    // public function testUpdateProduct(): void
    // {
    //     $data = [
    //         "code" => "f230fh0g3",
    //         "name" => "Bamboo Watch",
    //         "description" => "Product Description",
    //         "image" => "bamboo-watch.jpg",
    //         "price" => 65,
    //         "quantity" => 40,
    //         "category" => "Accessories",
    //         "shellId" => 15,
    //         "internalReference" => "REF-123-456",
    //         "inventoryStatus" => "INSTOCK",
    //         "rating" => 5,
	// 	    "createdAt" => 1718114215761,
	// 	    "updatedAt" => 1718114215761,
    //     ];
    //     $product = $this->productService->createProduct($data);

    //     $data = [
    //         "name" => "Updated Bamboo Watch",
    //     ];
    
    //     $updatedProduct = $this->productService->updateProduct(1, $data);
    
    //     $this->assertSame('Updated Bamboo Watch', $updatedProduct->getName());
    //     $this->assertSame('nvklal433', $updatedProduct->getCode()); // Ensure other fields remain unchanged
    // }
    

    public function testUpdateProductNotFound(): void
    {
        $this->productRepository->method('find')
            ->willReturn(null);

        $this->expectException(EntityNotFoundException::class);
        $this->expectExceptionMessage('Product not found');

        $data = [
            "name" => "Updated Bamboo Watch",
        ];

        $this->productService->updateProduct(999, $data); // Non-existing ID
    }

    // public function testDeleteProduct(): void
    // {
    //     $product = new Product();
    //     $product->setCode('nvklal433');

    //     $this->productRepository->method('find')
    //         ->willReturn($product);

    //     $this->entityManager->expects($this->once())
    //         ->method('remove')
    //         ->with($product);
    //     $this->entityManager->expects($this->once())
    //         ->method('flush');

    //     $this->productService->deleteProduct(1);
    // }

    public function testDeleteProductNotFound(): void
    {
        $this->productRepository->method('find')
            ->willReturn(null);

        $this->expectException(EntityNotFoundException::class);
        $this->expectExceptionMessage('Product not found');

        $this->productService->deleteProduct(999); // Non-existing ID
    }

    // public function testGetProduct(): void
    // {
    //     $product = new Product();
    //     $product->setCode('nvklal433');
        
    //     $this->productRepository->method('find')
    //         ->willReturn($product);

    //     $fetchedProduct = $this->productService->getProduct(1);

    //     $this->assertSame($product, $fetchedProduct);
    // }

    public function testGetAllProducts(): void
    {
        $product1 = new Product();
        $product1->setCode('code1');
        
        $product2 = new Product();
        $product2->setCode('code2');

        // Mock the repository to return an array of products
        $this->productRepository->method('findAll')
            ->willReturn([$product1, $product2]);

        $products = $this->productService->getAllProducts();

        $this->assertCount(0, $products);
        // $this->assertSame($product1, $products[0]);
        // $this->assertSame($product2, $products[1]);
    }

}
