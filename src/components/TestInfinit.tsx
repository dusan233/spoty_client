import React from "react";
import { List, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";

const Row = ({ index, style }: { index: any; style: any }) => (
  <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
    Row {index}
  </div>
);

const list = [
  { name: "dusan", age: 23 },
  { name: "zac", age: 11 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 30 },
  { name: "dude", age: 23 },
];
const some = ({ index, style }: any) => {
  const details = list[index - 1];
  if (index === 0) {
    return (
      <div style={style} className="hah">
        dd dsa dasdjs Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Iure, molestias. Cumque, nostrum explicabo, minima eos sapiente deleniti
        odio consequuntur impedit exercitationem illo reprehenderit doloribus
        doloremque pariatur, fugiat quae porro laborum? Lorem ipsum dolor sit
        amet consectetur adipisicing elit. Nisi assumenda nihil recusandae
        reiciendis obcaecati? Reprehenderit officiis mollitia temporibus qui
        esse, libero, incidunt quibusdam unde explicabo numquam eos quod
        possimus veritatis?
      </div>
    );
  }
  return (
    <div style={style}>
      <div>{details.name}</div>
      <h2>{details.age}</h2>
    </div>
  );
};

const TestInfinit = () => {
  return (
    <React.Fragment>
      <AutoSizer>
        {({ height, width }: any) => (
          <List
            className="List"
            height={height}
            rowHeight={60}
            rowCount={list.length + 1}
            rowRenderer={some}
            width={width}
          />
        )}
      </AutoSizer>
    </React.Fragment>
  );
};

export default TestInfinit;
