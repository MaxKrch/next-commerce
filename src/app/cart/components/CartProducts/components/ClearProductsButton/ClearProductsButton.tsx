import { ProductType } from '@model/products';
import { useRootStore } from '@providers/RootStoreContext';
import Button from '@components/Button';
import { observer } from 'mobx-react-lite';

const ClearActionSlot: React.FC<{ product: ProductType }> = ({ product }) => {
  const { cartStore } = useRootStore();

  return (
    <Button priority="secondary" onClick={() => cartStore.removeAllProductItems(product)}>
      Удалить все
    </Button>
  );
};

export default observer(ClearActionSlot);
