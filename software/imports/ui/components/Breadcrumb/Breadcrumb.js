import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import routes from '../../../startup/client/routes';
import i18n from 'meteor/universe:i18n';
 
  const findRouteName = url => routes[url];
const T = i18n.createComponent();
   
  
const getPaths = (pathname) => {
  const paths = ['/'];


  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr, index) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  console.log(paths);
  return paths;
};
 
 
 /* const BreadcrumbsItem = ({ ...rest, match }) => {
  const routeName = findRouteName(match.url);
  if (routeName) {
    return (
      match.isExact ?
      (
        <BreadcrumbItem active> {i18n.__('common','routes',routeName)}</BreadcrumbItem>
      ) :
      (
        <BreadcrumbItem>
          <Link to={match.url || ''}>
            {i18n.__('common','routes',routeName) }
          </Link>
        </BreadcrumbItem>
      )
    );
  }
  return null;
};

const Breadcrumbs = ({ ...rest, location : { pathname }, match }) => {
  const paths = getPaths(pathname);
  const i = 0;
  const items = paths.map((path, i) => <Route key={i++} path={path} component={BreadcrumbsItem} />);
  return (
    <Breadcrumb className="MainBreadcrumb">
      {items}
    </Breadcrumb>
  );
}; */
 
export default props => (
  <div>
   {/*  <Route path="/:path" component={Breadcrumbs} {...props}  /> */}

  </div>
);