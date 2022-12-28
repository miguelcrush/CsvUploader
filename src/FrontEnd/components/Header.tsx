import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Heading, IconButton, Input, Spacer, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';

export const Header = () => {

    const [isDrawerOpen, setDrawerIsOpen] = React.useState<boolean>(false);

    const btnRef = React.useRef();

    const onDrawerClose = () => {
        setDrawerIsOpen(false);
    }

    const onDrawerOpen = () => {
        setDrawerIsOpen(true);
    }

    return (
        <>
            <Drawer
                isOpen={isDrawerOpen}
                placement='right'
                onClose={onDrawerClose}
                finalFocusRef={btnRef.current}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>

                    <DrawerBody>
                        <Stack>
                            <Link href='/' onClick={() => { onDrawerClose() }}>Patient List</Link>
                            <Link href='/upload' onClick={() => { onDrawerClose() }}>Upload CSV</Link>
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onDrawerClose}>
                            Cancel
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Box border='1px solid gray.800'
                bg='gray.300'
                p={2}
            >
                <Flex>
                    <Center>
                        <Heading size="md">
                            Patient Data Uploader
                        </Heading>
                    </Center>
                    <Spacer />
                    <Box>
                        <IconButton ref={btnRef.current} id='hamburger-menu-icon' aria-label='menu' icon={<HamburgerIcon />} onClick={() => { onDrawerOpen() }} />
                    </Box>
                </Flex>
            </Box>
        </>
    )
}