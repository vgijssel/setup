/**
 * @file FilterList.h
 * The linked list class to support the Tree class and FilterChain class.
 * @note
 * This implementation is not meant to be directly used by the client code.
 *
 * @see Tree, FilterChain
 *
 * @author Haimo Zhang <zh.hammer.dev@gmail.com>
 */
#ifndef FILTERLIST_H
#define FILTERLIST_H

template <typename VAL_T>
class FilterNode
{
public:
	VAL_T value;
	FilterNode<VAL_T> *next;
	FilterNode(VAL_T const &v): value(v), next(NULL) { }
};

template <typename VAL_T>
class NodeIterator
{
public:
	/**
	 * Dereference the iterator to obtain the value it points at.
	 */
	VAL_T operator*() { return ptr->value; }
	/**
	 * Prefix increment operator.
	 *
	 * @note
	 * Only the prefix operator __without__ return value is implemented.
	 * Only use the standalone prefix increment statement, i.e.,
	 * `++iter`.
	 */
	void operator++() { ptr = ptr->next; }
	/**
	 * Comparison between two iterators.
	 *
	 * @note
	 * Only the `!=` operator is implemented, not the `==` operator.
	 */
	bool operator!=(NodeIterator<VAL_T> const &it) { return ptr != it.ptr; }
	NodeIterator(): ptr(NULL) { }
	NodeIterator(FilterNode<VAL_T> *n): ptr(n) { }
private:
	FilterNode<VAL_T> *ptr;
};

template <typename VAL_T>
class FilterList
{
public:
	FilterList(): head(NULL), tail(NULL), last_ptr(NULL) { }
	~FilterList()
	{
		FilterNode<VAL_T> *to_del;
		while (head) {
			to_del = head;
			head = head->next;
			delete to_del;
		}
	}
	/**
	 * Append an element.  The value of the argument is copied.
	 */
	void append(VAL_T const &v)
	{
		FilterNode<VAL_T> *new_node = new FilterNode<VAL_T>(v);
		if (head) {
			*tail = new_node;
		}
		else {
			head = new_node;
		}
		tail = &new_node->next;
		last_ptr = new_node;
	}
	/**
	 * Tell whether the linked list is empty.
	 */
	bool isEmpty() { return head == NULL; }
	typedef NodeIterator<VAL_T> iterator;
	/**
	 * An iterator pointing at the beginning of the linked list.
	 * Essentially pointing at the first node.
	 */
	NodeIterator<VAL_T> begin() { return NodeIterator<VAL_T>(head); }
	/**
	 * An iterator pointing at the end of the linked list.
	 * Essentially pointing at NULL.
	 */
	NodeIterator<VAL_T> end() { return NodeIterator<VAL_T>(); }
	/**
	 * An iterator pointing at the last node.
	 */
	NodeIterator<VAL_T> last() { return NodeIterator<VAL_T>(last_ptr); }
private:
	FilterNode<VAL_T> *head;
	FilterNode<VAL_T> **tail;
	FilterNode<VAL_T> *last_ptr;
};

#endif
