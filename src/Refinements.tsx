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
      <h3>Superfamily</h3>
      <RefinementList
        attribute="superFamily"
        operator="and"
        classNames={{
          list: "refinement-list",
          item: "refinement-list-item",
          label: "refinement-list-item__label",
          labelText: "refinement-list-item__label-text",
          count: "refinement-list-item__count",
        }}
      />

      <h3>Contrast</h3>
      <RefinementList
        attribute="contrast"
        operator="and"
        classNames={{
          list: "refinement-list",
          item: "refinement-list-item",
          label: "refinement-list-item__label",
          labelText: "refinement-list-item__label-text",
          count: "refinement-list-item__count",
        }}
      />

      <h3>Foundry</h3>
      <RefinementList
        attribute="foundryName"
        operator="and"
        classNames={{
          list: "refinement-list",
          item: "refinement-list-item",
          label: "refinement-list-item__label",
          labelText: "refinement-list-item__label-text",
          count: "refinement-list-item__count",
        }}
      />

      <h3>Webfont hosted</h3>
      <RefinementList
        attribute="hosted"
        operator="and"
        classNames={{
          list: "refinement-list",
          item: "refinement-list-item",
          label: "refinement-list-item__label",
          labelText: "refinement-list-item__label-text",
          count: "refinement-list-item__count",
        }}
      />

      <h3>Free to use</h3>
      <RefinementList
        attribute="freeToUse"
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
