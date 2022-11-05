/**
 * @todo
 * Implement and document the Tree class.
 */

/**
 * @file Tree.h
 * The tree class to support the filter framework.
 * @note
 * This implementation is not meant to be directly used by the client code.
 *
 * @see framework.h
 *
 * @author Haimo Zhang <zh.hammer.dev@gmail.com>
 */
#ifndef TREE_H
#define TREE_H

#include "FilterList.h"

template <typename VAL_T>
class Tree
{
public:
	VAL_T value;
	void appendChild(Tree<VAL_T> const &child) { subtrees.append(&child); }
protected:
	FilterList<Tree<VAL_T> *> subtrees;
};

#endif
