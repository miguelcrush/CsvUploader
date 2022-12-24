import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import {mode} from '@chakra-ui/theme-tools';

const theme = extendTheme({
    styles:{
        global: (props:StyleFunctionProps)=>({
            body:{
                fontFamily:'body',
                color: mode('gray.800', 'whiteAlpha.900')(props),
                bg: mode('white', 'gray.800')(props),
                lineHeight:'base',
                margin: '1em'
            }
        })
    }
})

export default theme;