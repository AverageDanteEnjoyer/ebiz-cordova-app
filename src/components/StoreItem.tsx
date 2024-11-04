import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";

type StoreItemProps = {
  id: number;
  title: string;
  image: string;
  price: string;
};

const StoreItem = ({ id, title, image, price }: StoreItemProps) => {
  const t = useTranslations("store");
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-[200px]">
      <Image
        src={image}
        alt={title}
        width={200}
        height={200}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{price}</p>
      <Button className="w-full">{t("buy")}</Button>
    </div>
  );
};

export default StoreItem;
