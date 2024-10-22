<?php

namespace App\Service;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;

class ProductService
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function createProduct(array $data): Product
    {
        $product = new Product();
        $this->populateProduct($product, $data);
        
        $this->entityManager->persist($product);
        $this->entityManager->flush();

        return $product;
    }

    public function updateProduct(int $id, array $data): Product
    {
        $product = $this->entityManager->getRepository(Product::class)->find($id);

        if (!$product) {
            throw new EntityNotFoundException('Product not found');
        }

        $this->populateProduct($product, $data);

        $this->entityManager->flush();

        return $product;
    }

    public function deleteProduct(int $id): void
    {
        $product = $this->entityManager->getRepository(Product::class)->find($id);

        if (!$product) {
            throw new EntityNotFoundException('Product not found');
        }

        $this->entityManager->remove($product);
        $this->entityManager->flush();
    }

    public function getProduct(int $id): ?Product
    {
        return $this->entityManager->getRepository(Product::class)->find($id);
    }

    public function getAllProducts(): array
    {
        return $this->entityManager->getRepository(Product::class)->findAll();
    }

    private function populateProduct(Product $product, array $data): void
    {
        if (isset($data['code'])) {
            $product->setCode($data['code']);
        }
        if (isset($data['name'])) {
            $product->setName($data['name']);
        }
        if (isset($data['description'])) {
            $product->setDescription($data['description']);
        }
        if (isset($data['image'])) {
            $product->setImage($data['image']);
        }
        if (isset($data['price'])) {
            $product->setPrice($data['price']);
        }
        if (isset($data['quantity'])) {
            $product->setQuantity($data['quantity']);
        }
        if (isset($data['category'])) {
            $product->setCategory($data['category']);
        }
        if (isset($data['shellId'])) {
            $product->setShellId($data['shellId']);
        }
        if (isset($data['internalReference'])) {
            $product->setInternalReference($data['internalReference']);
        }
        if (isset($data['inventoryStatus'])) {
            $product->setInventoryStatus($data['inventoryStatus']);
        }
        if (isset($data['rating'])) {
            $product->setRating($data['rating']);
        }
        $product->setCreatedAt(time());
        $product->setUpdatedAt(time());
    }
}
