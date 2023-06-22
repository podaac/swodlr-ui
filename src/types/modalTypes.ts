export interface AddProductModalProps {
    showAddProductModal: boolean;
  }

  export type arrayOfProductIds = string[]

  export interface EditProductModalProps {
    productsBeingEdited: arrayOfProductIds
  }

  export interface DeleteProductModalProps {
    productsBeingDeleted: arrayOfProductIds;
  }

  export interface GenerateProductModalProps {
    productsBeingGenerated: arrayOfProductIds;
  }