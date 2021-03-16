import {CurrentFilters} from "../../types";
import Drawer from '@material-ui/core/Drawer';
import React, {ChangeEvent, useState, useEffect} from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import styled from "styled-components";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import {filterGroups} from "./filterHelpers";
import Button from "@material-ui/core/Button";

const Sidebar = styled.div<{ isFilterOpen: boolean }>`
  display: flex;
  flex-direction: column;
  min-width: 360px;
  padding-left: 40px;
  text-align: left;
  overflow: auto;

  & .MuiTypography-root {
    font-size: 12px;
    line-height: 20px;
    letter-spacing: 0.25px;
    color: rgba(0, 0, 0, 0.87);
  }

  & .MuiFormLabel-root {
    font-size: 13px;
    // line-height: 16px;
    letter-spacing: 0.25px;
    color: rgba(0, 0, 0, 0.87);
    text-transform: uppercase;
    font-weight: 600;
  }

  & .MuiFormControl-root {
    &:not(:first-child) {
      margin-top: 15px;
    }
    
  }

  @media(max-width: 1100px) {
    min-width: 280px;
  }

  @media (max-width: 752px) {
    display: ${props => (props.isFilterOpen ? 'flex' : 'none')};
    width: 75%;
    height: auto;
    background-color: white;
    position: absolute;
    top: 100px;
    z-index: 10;
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 
      0px 8px 10px 1px rgb(0 0 0 / 14%), 
      0px 3px 14px 2px rgb(0 0 0 / 12%);
    padding: 30px;
  }
`;

type ConditionalProps = {
  condition: boolean;
  wrap: any;
  children: JSX.Element;
}

const ConditionalWrap: React.FC<ConditionalProps> = ({condition, wrap, children}) => condition ? wrap(children) : children;

type FilterBarProps = {
  currentFilters: CurrentFilters;
  matchCounts: {[k: string]: number};
  onChange: (
    group: keyof CurrentFilters
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  isFilterOpen: any;
  setIsFilterOpen: any;
};

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilters,
  matchCounts,
  onChange,
  onClear,
  isFilterOpen,
  setIsFilterOpen,
}) =>{ 
  const [wrapSidebar, setWrapSidebar] = useState(window.innerWidth < 770);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 770) {
        if (isFilterOpen) {
          setIsFilterOpen(false);
        }
        if (wrapSidebar) {
          setWrapSidebar(false);
        }
      } else {
        if (!wrapSidebar) {
          setWrapSidebar(true);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsFilterOpen, isFilterOpen, wrapSidebar]);

  return (
    <ConditionalWrap
      condition={wrapSidebar}
      wrap={(children: JSX.Element) => <Drawer anchor="left" open={isFilterOpen} onClose={()=> setIsFilterOpen(false)}>{children}</Drawer>
    }>
  <Sidebar isFilterOpen={isFilterOpen}>
    {filterGroups.map(({groupName, groupLabel, filters}) => (
      <FormControl key={groupName} component="fieldset">
        <FormLabel component="legend">{groupLabel}</FormLabel>
        <FormGroup>
          {filters.map(({label, name}) => (
            <FormControlLabel
              key={name}
              label={`${label} (${matchCounts[name]})`}
              control={
                <Checkbox
                  name={name}
                  checked={
                    !!currentFilters[
                      groupName as keyof CurrentFilters
                    ]?.includes(name)
                  }
                  onChange={onChange(groupName as keyof CurrentFilters)}
                />
              }
            />
          ))}
        </FormGroup>
      </FormControl>
    ))}
    <Button color="secondary" onClick={onClear}>
      clear
    </Button>
  </Sidebar>
  </ConditionalWrap>
);
};
