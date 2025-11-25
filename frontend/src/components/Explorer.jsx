import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Edit3,
  FileText,
  RefreshCw,
} from 'lucide-react';

const Explorer = () => {
  const [fileTree, setFileTree] = useState([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          isOpen: false,
          children: [
            { id: '3', name: 'App.jsx', type: 'file' },
            { id: '4', name: 'Header.jsx', type: 'file' },
          ],
        },
        { id: '5', name: 'utils', type: 'folder', isOpen: false, children: [] },
        { id: '6', name: 'index.js', type: 'file' },
      ],
    },
    {
      id: '7',
      name: 'public',
      type: 'folder',
      isOpen: false,
      children: [{ id: '8', name: 'index.html', type: 'file' }],
    },
    { id: '9', name: 'package.json', type: 'file' },
    { id: '10', name: 'README.md', type: 'file' },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingItem && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingItem]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const toggleFolder = (id, items = fileTree) => {
    return items.map((item) => {
      if (item.id === id && item.type === 'folder') {
        return { ...item, isOpen: !item.isOpen };
      }
      if (item.children) {
        return { ...item, children: toggleFolder(id, item.children) };
      }
      return item;
    });
  };

  const findItemById = (id, items = fileTree) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(id, item.children);
        if (found) return found;
      }
    }
    return null;
  };

  const addItem = (parentId, type) => {
    const newId = Date.now().toString();
    const newItem = {
      id: newId,
      name: type === 'folder' ? 'New Folder' : 'newfile.txt',
      type,
      ...(type === 'folder' && { isOpen: false, children: [] }),
    };

    const addToItems = (items) => {
      return items.map((item) => {
        if (item.id === parentId && item.type === 'folder') {
          return {
            ...item,
            isOpen: true,
            children: [...(item.children || []), newItem],
          };
        }
        if (item.children) {
          return { ...item, children: addToItems(item.children) };
        }
        return item;
      });
    };

    if (parentId === null) {
      setFileTree([...fileTree, newItem]);
    } else {
      setFileTree(addToItems(fileTree));
    }

    setEditingItem(newId);
    setNewItemName(newItem.name);
  };

  const deleteItem = (id) => {
    const deleteFromItems = (items) => {
      return items.filter((item) => {
        if (item.id === id) return false;
        if (item.children) {
          item.children = deleteFromItems(item.children);
        }
        return true;
      });
    };
    setFileTree(deleteFromItems(fileTree));
    setSelectedItem(null);
  };

  const renameItem = (id, newName) => {
    if (!newName.trim()) return;

    const renameInItems = (items) => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, name: newName };
        }
        if (item.children) {
          return { ...item, children: renameInItems(item.children) };
        }
        return item;
      });
    };

    setFileTree(renameInItems(fileTree));
    setEditingItem(null);
    setNewItemName('');
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      renameItem(id, newItemName);
    } else if (e.key === 'Escape') {
      setEditingItem(null);
      setNewItemName('');
    }
  };

  const FileIcon = ({ name }) => {
    const ext = name.split('.').pop();
    const iconClass = 'w-4 h-4';

    if (ext === 'jsx' || ext === 'js') return <FileText className={iconClass} color="#f7df1e" />;
    if (ext === 'json') return <FileText className={iconClass} color="#5382a1" />;
    if (ext === 'md') return <FileText className={iconClass} color="#0969da" />;
    if (ext === 'html') return <FileText className={iconClass} color="#e34c26" />;
    if (ext === 'css') return <FileText className={iconClass} color="#264de4" />;
    return <File className={iconClass} />;
  };

  const TreeItem = ({ item, level = 0 }) => {
    const isEditing = editingItem === item.id;
    const isSelected = selectedItem === item.id;

    return (
      <div>
        <div
          className={`flex items-center px-2 py-1 cursor-pointer hover:bg-gray-700 ${isSelected ? 'bg-gray-600' : ''}`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              setFileTree(toggleFolder(item.id));
            }
            setSelectedItem(item.id);
          }}
          onContextMenu={(e) => handleContextMenu(e, item)}
        >
          {item.type === 'folder' && (
            <span className="mr-1">
              {item.isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          )}
          {item.type === 'folder' ? (
            item.isOpen ? (
              <FolderOpen className="w-4 h-4 mr-2 text-yellow-500" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-yellow-500" />
            )
          ) : (
            <span className="mr-2">
              <FileIcon name={item.name} />
            </span>
          )}
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={() => renameItem(item.id, newItemName)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              className="bg-gray-800 text-white px-1 outline-none border border-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-sm truncate">{item.name}</span>
          )}
        </div>
        {item.type === 'folder' && item.isOpen && item.children && (
          <div>
            {item.children.map((child) => (
              <TreeItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-[#1e1e1e] text-white flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Explorer</h3>
        <div className="flex gap-1">
          <button onClick={() => addItem(null, 'file')} className="p-1 hover:bg-gray-700 rounded" title="New File">
            <FileText className="w-4 h-4" />
          </button>
          <button onClick={() => addItem(null, 'folder')} className="p-1 hover:bg-gray-700 rounded" title="New Folder">
            <Folder className="w-4 h-4" />
          </button>
          <button onClick={() => setFileTree([...fileTree])} className="p-1 hover:bg-gray-700 rounded" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {fileTree.map((item) => (
          <TreeItem key={item.id} item={item} />
        ))}
      </div>

      {contextMenu && (
        <div
          className="fixed bg-gray-800 border border-gray-700 rounded shadow-lg py-1 z-50 min-w-[160px]"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.item.type === 'folder' && (
            <>
              <button
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
                onClick={() => {
                  addItem(contextMenu.item.id, 'file');
                  setContextMenu(null);
                }}
              >
                <FileText className="w-4 h-4" />
                New File
              </button>
              <button
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
                onClick={() => {
                  addItem(contextMenu.item.id, 'folder');
                  setContextMenu(null);
                }}
              >
                <Folder className="w-4 h-4" />
                New Folder
              </button>
              <div className="border-t border-gray-700 my-1"></div>
            </>
          )}
          <button
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
            onClick={() => {
              setEditingItem(contextMenu.item.id);
              setNewItemName(contextMenu.item.name);
              setContextMenu(null);
            }}
          >
            <Edit3 className="w-4 h-4" />
            Rename
          </button>
          <button
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-700 flex items-center gap-2 text-red-400"
            onClick={() => {
              deleteItem(contextMenu.item.id);
              setContextMenu(null);
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Explorer;
