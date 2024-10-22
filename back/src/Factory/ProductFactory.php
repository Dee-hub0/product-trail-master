<?php

namespace App\Factory;

use App\Entity\Product;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Product>
 */
final class ProductFactory extends PersistentProxyObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
    }

    public static function class(): string
    {
        return Product::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'category' => self::faker()->text(50),
            'code' => self::faker()->text(9),
            'description' => self::faker()->text(15),
            'internalReference' => self::faker()->text(11),
            'inventoryStatus' => self::faker()->randomElement(["INSTOCK", "LOWSTOCK", "OUTOFSTOCK"]),
            'name' => self::faker()->text(50),
            'price' => self::faker()->randomFloat(),
            'quantity' => self::faker()->randomNumber(),
            'shellId' => self::faker()->randomNumber(),
            'createdAt' => self::faker()->randomNumber(),
            'updatedAt' => self::faker()->randomNumber(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Product $product): void {})
        ;
    }
}
