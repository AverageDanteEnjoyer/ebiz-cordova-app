// import { Button } from "@/components/ui/button";
// import { Link } from "@/i18n";
// import { api, staticURL } from "@/lib/api";
// import { RecipeDetails } from "@/types";
// import { useQuery } from "@tanstack/react-query";
// import { Book, ChefHat, Users } from "lucide-react";
// import { useTranslations } from "next-intl";
// import Image from "next/image";
// import React from "react";

// export default function Home() {
//   const t = useTranslations("home");

//   const { data: bestRecipe, isLoading } = useQuery({
//     queryKey: ["best-recipe"],
//     queryFn: async () => {
//       const res = await api.get("/recipes/best");
//       return (await res.json()) as Promise<RecipeDetails>;
//     },
//   });

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-900">{t("siteTitle")}</h1>
//           <div>
//             <Link href="/recipes">
//               <Button className="ml-4">{t("viewRecipes")}</Button>
//             </Link>
//             <Link href="/recipes/new">
//               <Button className="ml-4">{t("addRecipe")}</Button>
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main>
//         <div className="bg-white py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
//               {t("welcomeMessage")}
//             </h2>
//             <p className="mt-4 text-lg leading-6 text-gray-500">
//               {t("homeDescription")}
//             </p>
//           </div>
//         </div>

//         {!isLoading && bestRecipe ? (
//           <div className="bg-gray-100 py-12">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center items-center">
//               <div className="w-full md:w-1/2 p-4">
//                 <Image
//                   src={`${staticURL}/${bestRecipe.imagePath}`}
//                   alt={bestRecipe.name}
//                   width={800}
//                   height={600}
//                   unoptimized
//                 />
//               </div>
//               <div className="w-full md:w-1/2 p-4 text-center md:text-left">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-4">
//                   {bestRecipe.name}
//                 </h3>
//                 <p className="text-gray-700 mb-4">
//                   {t("featuredRecipeDescription")}
//                 </p>
//                 <Link href={`/recipes/${bestRecipe.id}`}>
//                   <Button>{t("viewRecipe")}</Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-gray-100 py-12">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center items-center">
//               <div className="w-full md:w-1/2 p-4">
//                 <div className="bg-gray-200 h-64 rounded-lg shadow-lg animate-pulse"></div>
//               </div>
//               <div className="w-full md:w-1/2 p-4 text-center md:text-left">
//                 <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto md:mx-0 mb-4 animate-pulse"></div>
//                 <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto md:mx-0 mb-4 animate-pulse"></div>
//                 <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto md:mx-0 mb-4 animate-pulse"></div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="bg-white py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
//               {t("whyChooseUs")}
//             </h3>
//             <div className="flex flex-wrap justify-center">
//               <div className="w-full md:w-1/3 p-4">
//                 <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
//                   <div className="mb-4 flex justify-center">
//                     <Book size={64} />
//                   </div>
//                   <h4 className="text-lg font-bold text-gray-900">
//                     {t("feature1Title")}
//                   </h4>
//                   <p className="mt-2 text-gray-600">
//                     {t("feature1Description")}
//                   </p>
//                 </div>
//               </div>
//               <div className="w-full md:w-1/3 p-4">
//                 <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
//                   {/* Replace with an icon representing feature */}
//                   <div className="mb-4 flex justify-center">
//                     <ChefHat size={64} />
//                   </div>
//                   <h4 className="text-lg font-bold text-gray-900">
//                     {t("feature2Title")}
//                   </h4>
//                   <p className="mt-2 text-gray-600">
//                     {t("feature2Description")}
//                   </p>
//                 </div>
//               </div>
//               <div className="w-full md:w-1/3 p-4">
//                 <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
//                   {/* Replace with an icon representing feature */}
//                   <div className="mb-4 flex justify-center">
//                     <Users size={64} />
//                   </div>
//                   <h4 className="text-lg font-bold text-gray-900">
//                     {t("feature3Title")}
//                   </h4>
//                   <p className="mt-2 text-gray-600">
//                     {t("feature3Description")}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Call to Action Section */}
//         <div className="bg-primary py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
//             <h3 className="text-2xl font-bold mb-6">{t("ctaTitle")}</h3>
//             <p className="mb-6">{t("ctaDescription")}</p>
//             <Link href="/recipes/new">
//               <Button className="bg-white text-primary hover:bg-gray-200 hover:text-primary">
//                 {t("ctaButton")}
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
