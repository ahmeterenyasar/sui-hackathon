import { Flex } from "@radix-ui/themes";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LinkCard } from "./LinkCard";
import type { Link } from "../types/profile";

interface SortableLinkProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (linkId: number) => void;
  onToggleVisibility: (linkId: number, isVisible: boolean) => void;
}

function SortableLink({ link, onEdit, onDelete, onToggleVisibility }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <LinkCard
        link={link}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleVisibility={onToggleVisibility}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

interface SortableLinkListProps {
  links: Link[];
  onEdit: (link: Link) => void;
  onDelete: (linkId: number) => void;
  onToggleVisibility: (linkId: number, isVisible: boolean) => void;
  onReorder: (newLinks: Link[]) => void;
}

export function SortableLinkList({
  links,
  onEdit,
  onDelete,
  onToggleVisibility,
  onReorder,
}: SortableLinkListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);

      const newLinks = arrayMove(links, oldIndex, newIndex).map((link, index) => ({
        ...link,
        position: index,
      }));

      onReorder(newLinks);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <Flex direction="column" gap="3">
          {links.map((link) => (
            <SortableLink
              key={link.id}
              link={link}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </Flex>
      </SortableContext>
    </DndContext>
  );
}
