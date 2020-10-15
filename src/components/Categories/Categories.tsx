import React, { useEffect } from "react";
import CategoriesStyles from "./Categories.module.css";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers";
import {
  getAllCategories,
  setCategLoading,
} from "../../store/actions/categories";
import Spinner from "../Spinner/Spinner";
import {Link} from 'react-router-dom'

const mapStateToProps = (state: RootState) => ({
  loading: state.categories.loading,
  categories: state.categories.categories,
});
const mapDispatchToProps = {
  getAllCategories,
  setCategLoading,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

const Categories: React.FC<ReduxProps> = ({
  getAllCategories,
  setCategLoading,
  loading,
  categories,
}) => {
  useEffect(() => {
    getAllCategories();
    return () => {
      setCategLoading(true);
    };
  }, [getAllCategories, setCategLoading]);

  return (
    <div className={CategoriesStyles.container}>
      {loading ? (
        <div className="loader-container">
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
          <h1>Categories</h1>
          <div className={CategoriesStyles.categories}>
            {categories.map((categ) => {
              return (
                <Link key={categ.id} to={`/category/${categ.id}`} className={CategoriesStyles.category}>
                  <img src={categ.icons[0].url} alt="" />
                  <div className={CategoriesStyles.category__content}>
                    <h2>{categ.name}</h2>
                  </div>
                </Link>
              );
            })}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default connector(Categories);
