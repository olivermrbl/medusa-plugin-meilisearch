import { ArrowUpRightOnBox, TriangleDownMini, XMarkMini } from "@medusajs/icons"
import { Container, Drawer, Heading, IconButton, Kbd } from "@medusajs/ui"
import Primitive from "@uiw/react-json-view"
import { CSSProperties, Suspense } from "react"
import { viewStyles } from "./json-view-styles"

type JsonViewSectionProps = {
  data: object
  title?: string
}

export const JsonViewSection = ({ data }: JsonViewSectionProps) => {
  return (
    <Container className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-x-4">
        <Heading level="h2">{"Meilisearch Product"}</Heading>
      </div>
      <Drawer>
        <Drawer.Trigger asChild>
          <IconButton
            size="small"
            variant="transparent"
            className="text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            <ArrowUpRightOnBox />
          </IconButton>
        </Drawer.Trigger>
        <Drawer.Content className="bg-ui-contrast-bg-base text-ui-code-fg-subtle !shadow-elevation-commandbar overflow-hidden border border-none max-md:inset-x-2 max-md:max-w-[calc(100%-16px)]">
          <div className="bg-ui-code-bg-base flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-x-4">
              <Drawer.Title asChild>
                <Heading className="text-ui-contrast-fg-primary">
                  {"Meilisearch Product"}
                </Heading>
              </Drawer.Title>
            </div>
            <div className="flex items-center gap-x-2">
              <Kbd className="bg-ui-contrast-bg-subtle border-ui-contrast-border-base text-ui-contrast-fg-secondary">
                esc
              </Kbd>
              <Drawer.Close asChild>
                <IconButton
                  size="small"
                  variant="transparent"
                  className="text-ui-contrast-fg-secondary hover:text-ui-contrast-fg-primary hover:bg-ui-contrast-bg-base-hover active:bg-ui-contrast-bg-base-pressed focus-visible:bg-ui-contrast-bg-base-hover focus-visible:shadow-borders-interactive-with-active"
                >
                  <XMarkMini />
                </IconButton>
              </Drawer.Close>
            </div>
          </div>
          <Drawer.Body className="flex flex-1 flex-col overflow-hidden px-[5px] py-0 pb-[5px]">
            <div className="bg-ui-contrast-bg-subtle flex-1 overflow-auto rounded-b-[4px] rounded-t-lg p-3">
              <Suspense
                fallback={<div className="flex size-full flex-col"></div>}
              >
                <Primitive
                  value={data}
                  displayDataTypes={false}
                  style={viewStyles as CSSProperties}
                  collapsed={1}
                >
                  <Primitive.Quote render={() => <span />} />
                  <Primitive.Null
                    render={() => (
                      <span className="text-ui-tag-red-icon">null</span>
                    )}
                  />
                  <Primitive.Undefined
                    render={() => (
                      <span className="text-ui-tag-blue-icon">undefined</span>
                    )}
                  />
                  <Primitive.Arrow>
                    <TriangleDownMini className="text-ui-contrast-fg-secondary -ml-[0.5px]" />
                  </Primitive.Arrow>
                  <Primitive.Colon>
                    <span className="mr-1">:</span>
                  </Primitive.Colon>
                </Primitive>
              </Suspense>
            </div>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </Container>
  )
}
