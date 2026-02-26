import React from "react";
import { useAppContext } from "../context/AppContext";
import categories from "../assets/categories";

// const categories = [
//   {
//     id: 1,
//     medicineName: "Paracetamol 500mg Tablets",
//     medicineImageUrl:
//       "https://assets.sayacare.in/api/images/product_image/large_image/23/74/Paracetamol-500-mg-Tablet_1.webp",
//     bgColor: "#FFE8E8",
//   },
//   {
//     id: 2,
//     medicineName: "Ibuprofen 400mg Tablets",
//     medicineImageUrl:
//       "https://5.imimg.com/data5/SELLER/Default/2023/7/325863554/WI/JM/SY/135658020/ibuprofen-tablets-ip-200-mg-.jpg",
//     bgColor: "#FFF4D6",
//   },
//   {
//     id: 3,
//     medicineName: "Amoxicillin 500mg Capsules",
//     medicineImageUrl:
//       "https://5.imimg.com/data5/SELLER/Default/2022/12/OC/PR/PS/108376694/cipmox-amoxicillin-500mg-capsules.png",
//     bgColor: "#E9FBE5",
//   },
//   {
//     id: 4,
//     medicineName: "Metformin 500mg Tablets",
//     medicineImageUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqdSqrMwgEQg5G8IYHrVHyMlfndq1dNBc1DQ&s",
//     bgColor: "#E8F5FF",
//   },
//   {
//     id: 5,
//     medicineName: "Omeprazole 20mg Capsules",
//     medicineImageUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpXVdBo0NOLiZXC4bwki1nEnfYi4dA5gMEbw&s",
//     bgColor: "#FFEFF7",
//   },
//   {
//     id: 6,
//     medicineName: "Cetirizine 10mg Tablets",
//     medicineImageUrl:
//       "https://5.imimg.com/data5/SELLER/Default/2022/3/HN/OH/CH/149355096/cetirizine-10mg-tablets.jpg",
//     bgColor: "#F2F0FF",
//   },
//   {
//     id: 7,
//     medicineName: "Salbutamol Inhaler 100mcg",
//     medicineImageUrl:
//       "https://5.imimg.com/data5/SELLER/Default/2025/2/490900406/UE/WY/JU/140631678/asthalin-inhaler-100-mcg-500x500.jpg",
//     bgColor: "#E7F8FF",
//   },
//   {
//     id: 8,
//     medicineName: "Insulin Injection 100IU/mL",
//     medicineImageUrl:
//       "https://www.macariushealth.com/media/products/WhatsApp_Image_2025-11-29_at_20.11.51_eddc4a93-removebg-preview.png",
//     bgColor: "#FFF5E1",
//   },
//   {
//     id: 9,
//     medicineName: "Aspirin 81mg Tablets",
//     medicineImageUrl:
//       "https://www.aspirin.ca/sites/g/files/vrxlpx30151/files/2021-06/Aspirin-81mg-tablets-30ct-carton_3.png",
//     bgColor: "#FFEFE2",
//   },
//   {
//     id: 10,
//     medicineName: "Vitamin D3 1000 IU Softgels",
//     medicineImageUrl:
//       "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now00365/l/61.jpg",
//     bgColor: "#E6FFF6",
//   },
// ];

const Categories = () => {
  const { navigate } = useAppContext();
  return (
    <div className="pt-16">
      <p className="text-2xl md:text-3xl font-medium">Categories</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
        {categories.map((cat, idx) => (
          <div
            onClick={() => {
              navigate(`/products/${cat.path}`);
              scrollTo(0, 0);
            }}
            key={idx}
            className={`group cursor-pointer p-3 gap-2 rounded-lg overflow-hidden flex flex-col justify-center items-center `}
            style={{ backgroundColor: cat.bgColor }}
          >
            <img
              src={cat.categoryImageUrl}
              alt=""
              className="rounded-lg w-full h-1/2 hover:scale-105 transition"
            />
            <p className="text-sm font-medium text-center">
              {cat.categoryName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
