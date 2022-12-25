import { Box, Center, propNames, Spacer, Stack } from '@chakra-ui/react';
import * as React from 'react';
import { Header } from './Header';

type ContentProps = {
    children: any;
}

export const Content = (props: ContentProps) => {
    return (

        <Box w={['100%', '75%', '50%']} p={4}>
            <Header />
            <Box mt={3} w={"full"}>
                <Center>
                    {props.children}
                </Center>
            </Box>
        </Box>
    )
}