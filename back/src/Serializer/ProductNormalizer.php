<?php
namespace App\Serializer;

use App\Entity\Product;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ProductNormalizer implements NormalizerInterface, DenormalizerInterface
{
    /**
     * Normalize a Product object into an array.
     *
     * @param Product $object The product object to normalize
     * @param string|null $format The format to normalize into (not used)
     * @param array $context Additional context (not used)
     * @return array Normalized product data
     */
    public function normalize($object, ?string $format = null, array $context = []): array
    {
        // Directly return an array mapping the object properties to their values
        return [
            'id' => $object->getId(),
            'code' => $object->getCode(),
            'name' => $object->getName(),
            'description' => $object->getDescription(),
            'image' => $object->getImage(),
            'category' => $object->getCategory(),
            'price' => $object->getPrice(),
            'quantity' => $object->getQuantity(),
            'internalReference' => $object->getInternalReference(),
            'shellId' => $object->getShellId(),
            'inventoryStatus' => $object->getInventoryStatus(),
            'rating' => $object->getRating(),
            'createdAt' => $object->getCreatedAt(),
            'updatedAt' => $object->getUpdatedAt(),
        ];
    }

    /**
     * Check if the data can be normalized.
     *
     * @param mixed $data The data to check
     * @param string|null $format The format (not used)
     * @param array $context Additional context (not used)
     * @return bool True if the data can be normalized, false otherwise
     */
    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Product;
    }

    /**
     * Denormalize an array into a Product object.
     *
     * @param array $data The data to denormalize
     * @param string $class The class to denormalize into
     * @param string|null $format The format (not used)
     * @param array $context Additional context
     * @return Product The denormalized product object
     */
    public function denormalize($data, string $class, ?string $format = null, array $context = []): Product
    {
        // Use the context to populate an existing object or create a new one
        $product = $context['object_to_populate'] ?? new Product();

        // Define the mapping of fields to their corresponding setter methods
        $fields = [
            'code' => 'setCode',
            'name' => 'setName',
            'category' => 'setCategory',
            'price' => 'setPrice',
            'quantity' => 'setQuantity',
            'internalReference' => 'setInternalReference',
            'shellId' => 'setShellId',
            'inventoryStatus' => 'setInventoryStatus',
            'createdAt' => 'setCreatedAt',
            'updatedAt' => 'setUpdatedAt',
        ];

        // Loop through the fields and set their values if present in the input data
        foreach ($fields as $key => $method) {
            if (array_key_exists($key, $data)) {
                $product->$method($data[$key]);
            }
        }

        return $product;
    }    

    /**
     * Check if the data can be denormalized into a Product.
     *
     * @param mixed $data The data to check
     * @param string $type The class type to denormalize into
     * @param string|null $format The format (not used)
     * @param array $context Additional context (not used)
     * @return bool True if the data can be denormalized, false otherwise
     */
    public function supportsDenormalization($data, string $type, ?string $format = null, array $context = []): bool
    {
        return Product::class === $type;
    }

    /**
     * Get the supported types for normalization/denormalization.
     *
     * @param string|null $format The format (not used)
     * @return array Supported types
     */
    public function getSupportedTypes(?string $format = null): array
    {
        return [Product::class => true];
    }
}
