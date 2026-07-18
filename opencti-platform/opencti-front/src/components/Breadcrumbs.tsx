import { FunctionComponent } from 'react';

interface element {
  label: string;
  link?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  elements: element[];
  noMargin?: boolean;
  isSensitive?: boolean;
}

const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = () => {
  return null;
};

export default Breadcrumbs;
