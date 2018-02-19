[Demo](https://filethis.github.io/ft-scrolling-behavior/components/ft-scrolling-behavior/demo/)    [API](https://filethis.github.io/ft-scrolling-behavior/components/ft-scrolling-behavior/)    [Repo](https://github.com/filethis/ft-scrolling-behavior)

### \<ft-scrolling-behavior\>

This behavior works around two very vexing browser scrolling problems.

1. When an element is scrolled with the mouse wheel, and it comes to the end of its scrollable content, the scrolling event will propagate up to the element's parent, and any ancestors, scrolling them in turn. There is no planet in the universe of graphical user interfaces on which this is correct. The fact that browsers ever behaved this way, and continue to behave this way is unforgivable. This behavior prevents the scrolling events from propagating out of the element over which the mouse cursor resides.
2. God only knows why, but elements that have dimensions that are "100%" cannot also use the "overflow:auto" style for scrolling. This behavior works around the problem by explicitly setting the dimenions of a scrolling element to the maximum within its parent when the element is resized. This is made possible through the use of polymer's [iron-resizable-behavior](https://www.webcomponents.org/element/PolymerElements/iron-resizable-behavior) magic.