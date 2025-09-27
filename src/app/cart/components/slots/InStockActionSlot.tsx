import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import style from '../../Cart.module.scss';
import { ProductType } from '@model/products';
import { useRootStore } from '@providers/RootStoreContext';
import Button from '@components/Button';

const InStockActionSlot: React.FC<{ product: ProductType }> = ({ product }) => {
  const { cartStore } = useRootStore();

  return (
    <div className={clsx(style['action-slot'])}>
      <Button onClick={() => cartStore.addToCart(product)}>
        Добавить
      </Button>
      <Button priority="secondary" onClick={() => cartStore.removeFromCart(product)}>
        Удалить
      </Button>
    </div>
  );
};

export default observer(InStockActionSlot);
