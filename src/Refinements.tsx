import {
  // CurrentRefinements,
  RefinementList,
  SearchBox,
} from "react-instantsearch";

// https://www.algolia.com/doc/api-reference/widgets/refinement-list/react
function Refinements() {
  return (
    <>
      <SearchBox
        classNames={{
          // root: "search-box",
          form: "search-box__form",
          // input: "search-box__input",
          // submit: "search-box__submit",
          // reset: "search-box__reset",
        }}
      />
      <br />
      {/* <CurrentRefinements
        classNames={{
          list: "current-ref-list",
        }}
      /> */}
      <RefinementList
        attribute="style"
        operator="and"
        classNames={{
          list: "refinement-list",
          item: "refinement-list-item",
          label: "refinement-list-item__label",
          labelText: "refinement-list-item__label-text",
          count: "refinement-list-item__count",
        }}
      />
    </>
  );
}

export default Refinements;
