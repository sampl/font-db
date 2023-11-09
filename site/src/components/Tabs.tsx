import * as RadixTabs from "@radix-ui/react-tabs";

interface TabItem {
  id: string;
  name: string;
  content: React.ReactNode;
}

export default function Tabs({
  label,
  items,
}: {
  label: string;
  items: TabItem[];
}) {
  return (
    <RadixTabs.Root defaultValue={items[0].id} className="tabs">
      <RadixTabs.List aria-label={label} className="tabs__list">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.id}
            value={item.id}
            className="tabs__item"
          >
            {item.name}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content
          key={item.id}
          value={item.id}
          className="tabs__content"
        >
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
