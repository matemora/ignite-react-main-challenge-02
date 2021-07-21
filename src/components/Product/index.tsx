import { MdAddShoppingCart } from "react-icons/md";
import { ProductFormatted } from "../../pages/Home";
import { ProductItem } from "./styles";

type ProductProps = Omit<ProductFormatted, 'price' | 'id'> & {
    handleAddProduct: () => void;
    amount: number;
};

export function ProductCard(props: ProductProps) {
    return (
        <ProductItem>
            <img src={props.image} alt={props.title} />
            <strong>{props.title}</strong>
            <span>{props.priceFormatted}</span>
            <button
                type="button"
                data-testid="add-product-button"
                onClick={props.handleAddProduct}
            >
                <div data-testid="cart-product-quantity">
                    <MdAddShoppingCart size={16} color="#FFF" />
                    {props.amount}
                </div>

                <span>ADICIONAR AO CARRINHO</span>
            </button>
        </ProductItem>
    );
}