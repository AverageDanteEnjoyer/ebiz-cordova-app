import { Link } from "@/i18n";
import { staticURL } from "@/lib/api";
import { cn } from "@/lib/utils";
import { RecipeListItem } from "@/types";
import { Star, StarHalf } from "lucide-react";
import Image from "next/image";
import React from "react";

type RecipeCardProps = React.HTMLAttributes<HTMLDivElement> & {
  recipe: RecipeListItem;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
};

const RecipeCard = ({
  recipe: { id, name, description, avgRating, commentCount, imagePath, user },
  className,
  width,
  height,
  aspectRatio,
  ...props
}: RecipeCardProps) => {
  const stars = (
    <div className="flex justify-center flex-row">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          fill={index < avgRating ? "currentColor" : "none"}
          className="text-black-500"
        />
      ))}
    </div>
  );

  return (
    <div className={cn("space-y-3 ", className)} {...props}>
      <div className="overflow-hidden">
        <Link href={`/recipes/${id}`}>
          <Image
            src={`${staticURL}/${imagePath}`}
            alt={name}
            width={width}
            height={height}
            className={cn(
              "h-auto w-auto object-cover transition-all hover:scale-110",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
            unoptimized
          />
        </Link>
      </div>
      <div className="space-y-1 text-sm px-2 pb-2">
        <Link href={`/recipes/${id}`}>
          <h3 className="font-bold leading-none text-lg hover:underline">
            {name}
          </h3>
        </Link>
        <div className="flex flex-col justify-center py-2">
          {stars}
          <p className="text-sm text-accent-foreground text-center">
            {commentCount}
          </p>
        </div>
        <p className="text-sm text-accent-foreground text-balance">
          {description}
        </p>
        <p className="text-xs text-muted-foreground">
          {user.firstName} {user.lastName}
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
