import { Center, propNames } from '@chakra-ui/react';
import * as React from 'react';

type ContentProps ={
    children: any;
}

export const Content = (props: ContentProps) =>{
    return (
        <Center>
            {props.children}
        </Center>
    )
}