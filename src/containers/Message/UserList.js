import React from "react";

const UsersList = props => {
    return (
        Object.keys(props.members).map(el => (
            <div key={el}>{el}</div>
        ))
    )
}

export default UsersList;