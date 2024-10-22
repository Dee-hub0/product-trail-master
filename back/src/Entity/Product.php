 <?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;
use App\State\ProductProvider;
use App\Repository\ProductRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ApiResource(
    operations: [
        new Post(),
        new Get(),
        new GetCollection(),
        new Patch(
            provider: ProductProvider::class
        ),
        new Delete(
            provider: ProductProvider::class
        )
    ],
    normalizationContext: ['groups' => ['read']],
    denormalizationContext: ['groups' => ['write']],
    order: ['createdAt' => 'DESC']
)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]    
    #[Groups(['read', 'write'])]
    private ?int $id = null;

    #[ORM\Column(length: 9, nullable: true)]
    #[Groups(['read', 'write'])]
    private ?string $code = null;

    #[ORM\Column(length: 50,)]
    #[Assert\NotBlank()]
    #[Groups(['read', 'write'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['read', 'write'])]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['read', 'write'])]
    private ?string $image = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank()]
    #[Groups(['read', 'write'])]
    private ?string $category = null;

    #[ORM\Column(nullable: true)]
    #[Assert\NotNull()]
    #[Groups(['read', 'write'])]
    private ?float $price = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['read', 'write'])]
    private ?int $quantity = null;

    #[ORM\Column(length: 11, nullable: true)]
    #[Groups(['read', 'write'])]
    private ?string $internalReference = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['read', 'write'])]
    private ?int $shellId = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Choice(['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'])]
    #[Groups(['read', 'write'])]
    private ?string $inventoryStatus = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['read', 'write'])]
    private ?float $rating = null;

    #[ORM\Column(type: Types::BIGINT)]
    #[Groups(['read', 'write'])]
    private ?string $createdAt = null;

    #[ORM\Column(type: Types::BIGINT)]
    #[Groups(['read', 'write'])]
    private ?string $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getInternalReference(): ?string
    {
        return $this->internalReference;
    }

    public function setInternalReference(string $internalReference): static
    {
        $this->internalReference = $internalReference;

        return $this;
    }

    public function getShellId(): ?int
    {
        return $this->shellId;
    }

    public function setShellId(int $shellId): static
    {
        $this->shellId = $shellId;

        return $this;
    }

    public function getInventoryStatus(): ?string
    {
        return $this->inventoryStatus;
    }

    public function setInventoryStatus(string $inventoryStatus): static
    {
        $this->inventoryStatus = $inventoryStatus;

        return $this;
    }

    public function getRating(): ?float
    {
        return $this->rating;
    }

    public function setRating(?float $rating): static
    {
        $this->rating = $rating;

        return $this;
    }

    public function getCreatedAt(): ?string
    {
        return $this->createdAt;
    }

    public function setCreatedAt(string $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?string
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(string $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

}
