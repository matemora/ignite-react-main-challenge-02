import { MdRemoveCircleOutline, MdAddCircleOutline, MdDelete } from "react-icons/md";
import { CartProduct } from "../../pages/Cart";
import { formatPrice } from "../../util/format";
import { CartData } from "./styles";

interface CartProductProps extends CartProduct {
    priceFormatted: string;
    handleProductDecrement: () => void;
    handleProductIncrement: () => void;
    handleRemoveProduct: () => void;
}

export function CartProductItem(props: CartProductProps) {
    return (
        <>
            <CartData>
                <img src={props.image} alt={props.title} />
            </CartData>
            <CartData>
                <strong>{props.title}</strong>
                <span>{props.priceFormatted}</span>
            </CartData>
            <CartData>
                <div>
                    <button
                        type="button"
                        data-testid="decrement-product"
                        disabled={props.amount <= 1}
                        onClick={props.handleProductDecrement}
                    >
                        <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                        type="text"
                        data-testid="product-amount"
                        readOnly
                        value={props.amount}
                    />
                    <button
                        type="button"
                        data-testid="increment-product"
                        onClick={props.handleProductIncrement}
                    >
                        <MdAddCircleOutline size={20} />
                    </button>
                </div>
            </CartData>
            <CartData>
                <strong>{formatPrice(props.price * props.amount)}</strong>
            </CartData>
            <CartData>
                <button
                    type="button"
                    data-testid="remove-product"
                    onClick={props.handleRemoveProduct}
                >
                    <MdDelete size={20} />
                </button>
            </CartData>
        </>
    );
}