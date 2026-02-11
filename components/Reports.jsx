'use client';

import React from 'react';
import { useState, useMemo } from 'react';
import { Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MOCK_DATA = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    status: 'Active',
    amount: '$2,500.00',
    date: '2024-01-15',
    category: 'Sales',
    description: 'Monthly sales report for Q1',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    status: 'Active',
    amount: '$3,200.00',
    date: '2024-01-14',
    category: 'Marketing',
    description: 'Campaign performance metrics',
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@example.com',
    status: 'Pending',
    amount: '$1,800.00',
    date: '2024-01-13',
    category: 'Operations',
    description: 'Quarterly operational review',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    status: 'Inactive',
    amount: '$950.00',
    date: '2024-01-12',
    category: 'Finance',
    description: 'Budget allocation report',
  },
  {
    id: 5,
    name: 'Robert Wilson',
    email: 'robert@example.com',
    status: 'Active',
    amount: '$4,100.00',
    date: '2024-01-11',
    category: 'Sales',
    description: 'Annual revenue projection',
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    status: 'Active',
    amount: '$2,750.00',
    date: '2024-01-10',
    category: 'Marketing',
    description: 'Social media engagement report',
  },
  {
    id: 7,
    name: 'David Martinez',
    email: 'david@example.com',
    status: 'Pending',
    amount: '$1,200.00',
    date: '2024-01-09',
    category: 'Operations',
    description: 'Employee performance review',
  },
  {
    id: 8,
    name: 'Jennifer Taylor',
    email: 'jennifer@example.com',
    status: 'Active',
    amount: '$3,600.00',
    date: '2024-01-08',
    category: 'Finance',
    description: 'Expense tracking report',
  },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 100];

export default function ReportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [data, setData] = useState(MOCK_DATA);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when search changes
  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Handle row click to show details
  const handleRowClick = (item) => {
    setSelectedItem(item);
    setShowDetailDialog(true);
  };

  // Handle delete dialog
  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setDeleteItemId(id);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteItemId) {
      setData(data.filter((item) => item.id !== deleteItemId));
      setShowDeleteDialog(false);
      setDeleteItemId(null);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Reports
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage and view all your business reports in one place
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          {/* Search Bar */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, email, or category..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 py-2 w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item)}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                        {item.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {item.date}
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => handleDeleteClick(item.id, e)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                    >
                      No reports found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Showing {startIndex + 1} to{' '}
                {Math.min(startIndex + itemsPerPage, filteredData.length)} of{' '}
                {filteredData.length} results
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Per page:
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-16 bg-transparent">
                      {itemsPerPage}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => handleItemsPerPageChange(option)}
                        className={
                          itemsPerPage === option ? 'bg-slate-100 dark:bg-slate-700' : ''
                        }
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }
                disabled={currentPage === 1}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={
                        currentPage === page ? 'default' : 'outline'
                      }
                      className="w-10 h-10 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(totalPages, prev + 1)
                  )
                }
                disabled={currentPage === totalPages}
                variant="outline"
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              View complete information about this report
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Name
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedItem.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedItem.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedItem.category}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(selectedItem.status)}`}
                  >
                    {selectedItem.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount
                  </label>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {selectedItem.amount}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedItem.date}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <p className="text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                  {selectedItem.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this report? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
