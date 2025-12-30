import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { requestBuy } from "../../features/transaction/transactionSlice";

export default function BuyModal({ credit, onClose }: any) {
  const [price, setPrice] = useState(credit.price);
  const dispatch = useAppDispatch();

  const submit = () => {
    dispatch(
      requestBuy({
        creditId: credit.id,
        buyerId: "company-id",
        sellerId: credit.farmerId,
        price,
      })
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-900 p-6 rounded w-96">
        <h3 className="mb-4">Buy Carbon Credit</h3>
        <input
          className="w-full bg-slate-800 p-2 mb-4"
          value={price}
          onChange={e => setPrice(+e.target.value)}
        />
        <button
          onClick={submit}
          className="w-full bg-primary py-2 rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
