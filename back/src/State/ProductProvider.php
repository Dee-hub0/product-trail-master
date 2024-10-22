<?php

namespace App\State;

use App\Entity;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProductProvider implements ProviderInterface
{
    protected EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * Retrieve a Product by its ID.
     *
     * @param int $productId The ID of the product to retrieve
     * @return Entity\Product The found product
     * @throws NotFoundHttpException If the product is not found
     */
    protected function getProduct(int $productId): Entity\Product
    {
        $product = $this->em->getRepository(Entity\Product::class)->find($productId); // Simplified method

        if (!$product) {
            throw new NotFoundHttpException("Produit introuvable");
        }

        return $product;
    }

    /**
     * Provide a Product based on the operation and URI variables.
     *
     * @param Operation $operation The operation context
     * @param array $uriVariables The URI variables (should contain 'id')
     * @param array $context Additional context
     * @return Entity\Product|null The product or null if not found
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?Entity\Product
    {
        if (!isset($uriVariables['id'])) {
            throw new NotFoundHttpException("ID produit manquant"); // Handle missing ID
        }

        $productId = (int)$uriVariables['id'];
        return $this->getProduct($productId);
    }
}
