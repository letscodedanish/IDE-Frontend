import {ReactNode} from 'react';
import styled from "@emotion/styled";

export const Sidebar = ({children}: { children: ReactNode }) => {
  return (
    <Aside>
      {children}
    </Aside>
  )
}

const Aside = styled.aside`
  height: 100vh;
  border-right: 2px solid;
  border-color: #242424;
  padding-top: 3px;
  background-color: black;
`

export default Sidebar
