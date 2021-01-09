"use strict";

/*
usage:
HTML:
<div onclick="myMenu.popup(event);">...</div>
JS:
let myMenu = new Menubox( "menu1", { "itemKey1": "itemText1", "itemKey2": "itemText2", "separatorKey1": null, "itemKey3": "itemText3" } );
window.addEventListener("menubox", menuboxEvent);
function menuboxEvent(evt)
{
console.log("menuboxEvent:", evt.detail.menuId, evt.detail.itemKey);
};
 */

class Menubox
{
	constructor(id, menuItems)
	{
		this.htmlElement = document.createElement("div");
		this.htmlElement.setAttribute("data-menubox", id);
		for (let itemKey in menuItems)
		{
			let menuItem = document.createElement("div");
			if (menuItems[itemKey] !== null)
			{
				menuItem.setAttribute("data-menuitem", itemKey);
				menuItem.innerHTML = menuItems[itemKey];
				menuItem.onclick = this._menuItemClick;
			}
			else
			{
				menuItem.className = "separator";
				menuItem.innerHTML = "&#160;";
			};
			this.htmlElement.appendChild(menuItem);
		};
		this.htmlElement.style.position = "absolute";
		this.htmlElement.style.top = 0;
		this.htmlElement.style.left = 0;
		this.htmlElement.style.visibility = "hidden";
		this.attributes = {};
		document.body.appendChild(this.htmlElement);
		window.addEventListener("click", Menubox.HideAll);
	};

	static HideAll()
	{
		let allMenuboxes = document.querySelectorAll("[data-menubox]");
		for (let i = 0, ii = allMenuboxes.length; i < ii; i += 1)
		{
			allMenuboxes[i].style.visibility = "hidden";
		};
	};

	_menuItemClick(clickEvent)
	{
		let menuId = clickEvent.target.parentElement.getAttribute("data-menubox");
		let itemKey = clickEvent.target.getAttribute("data-menuitem");
		let context = clickEvent.target.parentElement.getAttribute("data-context");
		window.dispatchEvent(new CustomEvent("menubox",
			{
				"detail":
				{
					"menuId": menuId,
					"itemKey": itemKey,
					"context": context
				}
			}
			));
	};

	popup(clickEvent, context = null)
	{
		this.popupAt(clickEvent.clientY + document.documentElement.scrollTop, clickEvent.clientX + document.documentElement.scrollLeft, context);
		clickEvent.stopPropagation();
	};

	popupAt(topPosition, leftPosition, context = null)
	{
		Menubox.HideAll();
		this.htmlElement.style.top = topPosition + "px";
		this.htmlElement.style.left = leftPosition + "px";
		this.htmlElement.style.visibility = "visible";
		this.htmlElement.setAttribute("data-context", context);
	};

};