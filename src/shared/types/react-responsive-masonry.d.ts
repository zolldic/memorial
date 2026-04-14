declare module "react-responsive-masonry" {
  import * as React from "react";

  export const ResponsiveMasonry: React.FC<{
    columnsCountBreakPoints?: Record<number, number>;
    children: React.ReactNode;
    className?: string;
  }>;

  export const Masonry: React.FC<{
    columnsCount?: number;
    gutter?: string;
    children: React.ReactNode;
    className?: string;
  }>;

  export default Masonry;
}
