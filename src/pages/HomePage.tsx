import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthContext from "@/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string; // The image URL
}

const fetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get("https://fakestoreapi.com/products");
  return res.data;
};

const createProduct = async (
  newProduct: Omit<Product, "id">
): Promise<Product> => {
  const res = await axios.post("https://fakestoreapi.com/products", newProduct);
  return res.data;
};

const updateProduct = async ({
  id,
  updatedProduct,
}: {
  id: number;
  updatedProduct: Omit<Product, "id">;
}): Promise<Product> => {
  const res = await axios.put(
    `https://fakestoreapi.com/products/${id}`,
    updatedProduct
  );
  return res.data;
};

const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`https://fakestoreapi.com/products/${id}`);
};

const Navbar: React.FC = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  return (
    <nav className="bg-gray-50 shadow text-black/85 py-8 px-16 flex justify-between">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Button onClick={() => setIsAuthenticated(false)}>Logout</Button>
    </nav>
  );
};

interface ProductFormProps {
  initialData?: Omit<Product, "id">;
  onSubmit: (data: Omit<Product, "id">) => void;
  onClose: () => void;
  title: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "", // Default empty string for image
  },
  onSubmit,
  onClose,
  title,
}) => {
  const [titleInput, setTitleInput] = useState(initialData.title);
  const [priceInput, setPriceInput] = useState(initialData.price.toString());
  const [descriptionInput, setDescriptionInput] = useState(
    initialData.description
  );
  const [categoryInput, setCategoryInput] = useState(initialData.category);
  const [imageInput, setImageInput] = useState(initialData.image);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: titleInput,
      price: parseFloat(priceInput),
      description: descriptionInput,
      category: categoryInput,
      image: imageInput,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label> {/* Label for image input */}
        <Input
          id="image"
          value={imageInput}
          onChange={(e) => setImageInput(e.target.value)}
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
        <Button variant="ghost" onClick={onClose} type="button">
          Cancel
        </Button>
      </DialogFooter>
    </form>
  );
};

const HomePage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error.message}</p>;

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Products</h2>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>Create Product</Button>
            </DialogTrigger>
            <DialogContent>
              <ProductForm
                title="Create Product"
                onSubmit={(data) => {
                  createMutation.mutate(data, {
                    onSuccess: () => setCreateOpen(false),
                  });
                }}
                onClose={() => setCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ul className="space-y-4">
          {data?.map((product) => (
            <li
              key={product.id}
              className="border p-4 rounded flex items-center space-x-4" // Added flex and space-x for layout
            >
              {/* Product Image */}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-md" // Tailwind classes for image size and style
                />
              )}

              <div className="flex-grow">
                {" "}
                {/* This div takes up available space */}
                <p className="font-semibold">{product.title}</p>
                <p>${product.price.toFixed(2)}</p>
              </div>
              <div className="flex-shrink-0 space-x-2">
                {" "}
                {/* Buttons stay on the right */}
                <Dialog
                  open={updateOpen && selectedProduct?.id === product.id}
                  onOpenChange={(open) => {
                    if (!open) setSelectedProduct(null);
                    setUpdateOpen(open);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setUpdateOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {selectedProduct && (
                      <ProductForm
                        title="Update Product"
                        initialData={selectedProduct}
                        onSubmit={(updatedData) => {
                          updateMutation.mutate(
                            {
                              id: selectedProduct.id,
                              updatedProduct: updatedData,
                            },
                            {
                              onSuccess: () => {
                                setUpdateOpen(false);
                                setSelectedProduct(null);
                              },
                            }
                          );
                        }}
                        onClose={() => {
                          setUpdateOpen(false);
                          setSelectedProduct(null);
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={deleteOpen && selectedProduct?.id === product.id}
                  onOpenChange={(open) => {
                    if (!open) setSelectedProduct(null);
                    setDeleteOpen(open);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setDeleteOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Product</DialogTitle>
                    </DialogHeader>
                    <p>
                      Are you sure you want to delete &quot;{product.title}
                      &quot;?
                    </p>
                    <DialogFooter className="mt-4 space-x-2">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (selectedProduct) {
                            deleteMutation.mutate(selectedProduct.id, {
                              onSuccess: () => {
                                setDeleteOpen(false);
                                setSelectedProduct(null);
                              },
                            });
                          }
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setDeleteOpen(false);
                          setSelectedProduct(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HomePage;
