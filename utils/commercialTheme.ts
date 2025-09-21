import { Benefit, Storefront, BenefitSortCriteria } from "@/shared/types/types";
import { getCategoryId } from "./helper";

export const sortBenefits = (
  benefits: Benefit[],
  categories: any,
  storefront: Storefront
) => {
  if (
    (storefront?.benefitSortBy === "Category" && categories) ||
    storefront?.benefitSortBy === "BenefitType"
  ) {
    const obj: { [key: string]: Benefit[] } = {};
    storefront?.benefitSortCriteria.forEach((el: BenefitSortCriteria) => {
      //Might need to use .toLowerCase here
      if (storefront?.benefitSortBy === "BenefitType" && el.benefitType) {
        obj[el.benefitType?.toLowerCase()] = [];
      } else {
        obj[getCategoryId(categories, el?.categoryId).name?.toLowerCase()] = [];
      }
    });
    const categoriesUpdated: { [key: string]: Benefit[] } = obj;
    if (storefront?.benefitSortBy === "BenefitType") {
      benefits.forEach((benefit: Benefit) => {
        categoriesUpdated[benefit.type].push(benefit);
      });
    } else {
      if (categories?.length > 0) {
        // benefits.forEach((benefit) => {
        const nameSortedArray = storefront?.benefitSortCriteria.map((el) => {
          const { name, id } = categories?.find(
            (item: { name: string; id: number }) => {
              return item.id === el.categoryId;
            }
          );
          return { name, id, sortOrder: el.sortOrder, sortBy: el.sortBy };
        });

        nameSortedArray.forEach((el: BenefitSortCriteria) => {
          const arr = benefits.filter(
            (benefit) => benefit?.category?.id === el.id
          );

          // Define a mapping of sortBy fields to actual property names
          const sortByMappings: {
            CreatedDate: string;
            StartDate: string;
            ActiveDate: string;
          } = {
            CreatedDate: "createdAt", // Change this mapping as needed
            StartDate: "startDate",
            ActiveDate: "activeDate",
          };

          // Sort the arr based on sortBy and sortOrder
          arr.sort((a: any, b: any) => {
            const sortByField: string = sortByMappings[el.sortBy];
            const dateA = new Date(a[sortByField]);
            const dateB = new Date(b[sortByField]);

            if (el.sortOrder === "asc") {
              return dateA > dateB ? 1 : -1;
            } else {
              return dateA > dateB ? -1 : 1;
            }
          });

          if (el.name) {
            categoriesUpdated[el.name?.toLowerCase()] = arr;
          }
        });
      }
    }
    return categoriesUpdated;
  }
};
