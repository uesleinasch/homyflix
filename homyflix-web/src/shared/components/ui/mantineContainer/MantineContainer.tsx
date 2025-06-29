import type { JSX, ReactNode } from 'react'
import styles from './style.module.css'
import { Container, ScrollArea, type ContainerProps } from '@mantine/core'

interface CustomContainerProps extends Omit<ContainerProps, 'children'> {
  children: ReactNode
  maxHeight?: string | number
  scrollbarSize?: number
  scrollType?: 'scroll' | 'hover' | 'always'
  enableAutosize?: boolean
}

const MantineContainer = ({ 
  children, 
  maxHeight = 'calc(100vh - 120px)',
  scrollbarSize = 8,
  scrollType = 'scroll',
  enableAutosize = true,
  ...props 
}: CustomContainerProps): JSX.Element => {
  
  const containerContent = enableAutosize ? (
    <ScrollArea.Autosize 
      mah={maxHeight}
      type={scrollType}
      scrollbarSize={scrollbarSize}
      scrollHideDelay={1500}
      style={{ flex: 1, width: '100%' }}
    >
      {children}
    </ScrollArea.Autosize>
  ) : (
    children
  );

  return (
    <Container
      className={styles.container}
      fluid
      miw="100%"
      style={{ 
        minHeight: '100%', 
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflow: enableAutosize ? 'hidden' : 'auto'
      }}
      {...props}
    >
      {containerContent}
    </Container>
  )
}

export default MantineContainer
