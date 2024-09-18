import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategorySelect from "../../components/CategorySelect";
import { FaUpload } from "react-icons/fa";

const AdminProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);

  const [images, setImages] = useState(productData?.images || []);
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || []);
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImages(productData.images || []);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    setUploading(true);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Zdjęcia dodane pomyślnie", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setImages((prevImages) => [...prevImages, ...res.images]);
    } catch (err) {
      toast.error("Błąd podczas dodawania zdjęć", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category[category.length - 1]); // Wybieramy najniższą podkategorię
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const data = await updateProduct({ productId: params._id, formData });

      if (data?.error) {
        toast.error(data.error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else {
        toast.success(`Produkt pomyślnie zaktualizowany`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Aktualizacja produktu nie powiodła się. Spróbuj ponownie.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Czy na pewno chcesz usunąć ten produkt?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" jest usunięty`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Usunięcie nie powiodło się. Spróbuj ponownie.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Zaktualizuj / Usuń Produkt</h2>

          {uploading && <div className="text-white">Przesyłanie...</div>}

          {images.length > 0 && (
            <div className="text-center mb-6">
              <div className="relative">
                <img
                  src={images[currentImageIndex]}
                  alt="product"
                  className="block mx-auto max-h-64 rounded-lg"
                />
                <button
                  onClick={handlePrevImage}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-full"
                >
                  &lt;
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-full"
                >
                  &gt;
                </button>
              </div>
              <p className="text-white mt-2">
                Zdjęcie {currentImageIndex + 1} z {images.length}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-white font-bold mb-2">
              {images.length > 0 ? "Zmień zdjęcia" : "Załaduj zdjęcia"}
              <div className="flex items-center justify-center mt-2">
                <label className="cursor-pointer flex flex-col items-center bg-gray-700 text-white rounded-lg py-2 px-4 hover:bg-gray-600">
                  <FaUpload className="text-2xl" />
                  <span className="mt-1">Wybierz zdjęcia</span>
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={uploadFileHandler}
                    className="hidden"
                  />
                </label>
              </div>
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-white font-bold mb-2">Nazwa</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-white font-bold mb-2">Cena</label>
                <input
                  type="number"
                  id="price"
                  className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-white font-bold mb-2">Ilość</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="brand" className="block text-white font-bold mb-2">Marka</label>
                <input
                  type="text"
                  id="brand"
                  className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-white font-bold mb-2">Liczba w magazynie</label>
                <input
                  type="number"
                  id="stock"
                  className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <CategorySelect onCategorySelect={setCategory} />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-white font-bold mb-2">Opis produktu</label>
              <textarea
                id="description"
                className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg text-lg font-bold bg-green-600 text-white"
              >
                Aktualizuj
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-3 px-6 rounded-lg text-lg font-bold bg-red-600 text-white"
              >
                Usuń
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;