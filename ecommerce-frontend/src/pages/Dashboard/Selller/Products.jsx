import { useEffect, useState } from "react";
import { fetchProductsBySeller, removeProduct } from "../../../app/API/productsApi";
import { useDispatch, useSelector } from "react-redux";
import useNavigateTransition from "../../../hooks/useNavigateTransition";
import nProgress from "nprogress";
import NoProductsAvailable from "../../../components/NoProductsAvailable";
import { handleError } from "../../../hooks/functions";
import Loading from "../../../components/Loading";

const Products = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [products, setProducts] = useState(null);
  const navigateTransition = useNavigateTransition();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        nProgress.start();
        const data = await fetchProductsBySeller(token, user.username);
        console.log(data);
        setProducts(data);
      } catch (err) {
        handleError(err, navigateTransition, useDispatch, false);
      } finally {
        nProgress.done();
      }
    };
    loadProducts();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      const pakka = confirm(`Do you want to delete product ${id}?`);
      if (pakka) {
        await removeProduct(id, token);
        setProducts((products) => products.filter((p) => p.id !== id));
        alert(`Product ${id} deleted`);
      }
    } catch (err) {
      handleError(err, navigateTransition, useDispatch)
    }
  };

  return (
    <div className="w-full h-full flex-grow">
      {!products ? (
        <Loading component={"Products"} />
      ) : products.length ? (
        <ul>
          {products?.map?.((p) => {
            return (
              <li
                key={p.id}
                onClick={() => navigateTransition(`/product/${p.id}`)}
                className="flex items-center justify-between space-x-4 p-4 rounded bg-gray-100 my-2 cursor-pointer"
              >
                <div className="flex space-x-4">
                  <div className="px-2 py-0.5 h-fit rounded bg-gray-300">#{p.id}</div>
                  <div className="flex flex-col space-y-1">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-sm">{p.shortDescription}</div>
                  </div>
                </div>
                <button
                  className="bg-red-600 px-2 py-0.5 rounded text-white"
                  onClick={(e) => handleDelete(e, p.id)}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <NoProductsAvailable />
      )}
    </div>
  );
};

export default Products;
