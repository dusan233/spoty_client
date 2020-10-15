import React  from 'react';
import {Redirect, Route} from 'react-router-dom';

type Props = {
    isAuth: boolean;
    component: any;
    path: string;
    exact?: boolean;
}

const ProtectedRoute:React.FC<Props> = ({isAuth, component, ...rest}) => {
    return isAuth ? <Route 
    {...rest}
    component={component}
    /> : <Redirect to={{
        pathname: "/login"
    }} />
}
export default ProtectedRoute
