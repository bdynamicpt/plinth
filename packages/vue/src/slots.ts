import { Comment, Fragment, Static, Text, type VNode } from 'vue';

/** Whether a slot's nodes print anything: a slot that renders only a false v-if does not. */
export const hasContent = (nodes: VNode[] | undefined): boolean =>
  (nodes ?? []).some((node) => {
    if (node.type === Comment) return false;
    if (node.type === Text || node.type === Static) return String(node.children).trim() !== '';
    if (node.type === Fragment) return hasContent(node.children as VNode[]);
    return true;
  });
