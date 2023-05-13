export type PageWithLayout = React.FC<PageProps> & {
  Layout?: React.FC<LayoutProps>;
};
