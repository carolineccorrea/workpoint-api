import { Router } from "express";
import 'reflect-metadata';

/* Controllers */
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateProductController } from "./controllers/product/CreateProductController";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { EditCategoryController } from "./controllers/category/EditCategoryController";
import { ListCategoriesController } from "./controllers/category/ListCategoriesController";
import { DeleteCategoryController } from "./controllers/category/DeleteCategoryController";
import { EditProductController } from "./controllers/product/EditProductController";
import { ListProductsController } from "./controllers/product/ListProductsController";
import { DeleteProductController } from "./controllers/product/DeleteProductController";
import { SaleProductController } from "./controllers/product/SaleProductController";
import { CreateCustomerController } from "./controllers/customer/CreateCustomerController";
import { ListCustomersController } from "./controllers/customer/ListCusomersController";
import { handleController } from "./controllers/protocols/HandleController";
import { CreateServiceOrderController } from "./controllers/serviceOrder/CreateServiceOrderController";
import { SearchCustomerController } from "./controllers/customer/SearchCustomerController";

const router = Router();

/* USER */
router.post("/user", new CreateUserController().handle);
router.post("/auth", new AuthUserController().handle);

/* CATEGORY */
router.post(
  "/category",
  isAuthenticated,
  new CreateCategoryController().handle
);
router.put(
  "/category/edit",
  isAuthenticated,
  new EditCategoryController().handle
);
router.get(
  "/categories",
  isAuthenticated,
  new ListCategoriesController().handle
);
router.delete(
  "/category/delete",
  isAuthenticated,
  new DeleteCategoryController().handle
);

/* PRODUCT */
router.post("/product", isAuthenticated, new CreateProductController().handle);
router.put(
  "/product/edit",
  isAuthenticated,
  new EditProductController().handle
);
router.get("/products", isAuthenticated, new ListProductsController().handle);
router.delete(
  "/product/delete",
  isAuthenticated,
  new DeleteProductController().handle
);

//vender produto
router.put(
  "/product/sale",
  isAuthenticated,
  handleController(SaleProductController)
);

// Customer

/*
router.post(
  "/customer",
  isAuthenticated,
  new CreateCustomerController().handle
);
*/

//Clientes
router.post("/customer", isAuthenticated, handleController(CreateCustomerController));

router.get("/customers/search", isAuthenticated, handleController(SearchCustomerController));

router.get(
  "/customers",
  isAuthenticated,
  new ListCustomersController().handle
);

//Ordem de Servico

router.post("/serviceorder",
 isAuthenticated,
 handleController(CreateServiceOrderController)
);



export { router };
