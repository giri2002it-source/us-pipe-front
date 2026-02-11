'use client';

import { useState, useEffect } from "react";
import {
  Eye,
  Pencil,
  FileText,
  FileSpreadsheet,
  File,
  Download,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

/* ==================== Estimation Card ==================== */
const EstimationCard = ({ name, count, imageUrl, onViewImage, onEdit }) => (
  <div className="bg-gradient-to-br from-card to-secondary/5 rounded-xl border border-border/50 p-6 flex flex-col items-center justify-center text-center min-h-[180px] hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-semibold">
      {name}
    </p>
    <p className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">{count}</p>
    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="outline" size="sm" onClick={onViewImage} className="gap-2 bg-background hover:bg-primary/10">
        <Eye className="h-4 w-4" /> View
      </Button>
      <Button variant="outline" size="sm" onClick={onEdit} className="gap-2 bg-background hover:bg-primary/10">
        <Pencil className="h-4 w-4" /> Edit
      </Button>
    </div>
  </div>
);

/* ==================== Bill Table ==================== */
const BillTable = ({ items }) => {
  const overallTotal = items.reduce((sum, item) => sum + item.count * item.price, 0);

  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-primary to-primary/90 hover:bg-primary">
            <TableHead className="text-background font-semibold">Symbol Name</TableHead>
            <TableHead className="text-background text-center font-semibold">Count</TableHead>
            <TableHead className="text-background text-center font-semibold">Price</TableHead>
            <TableHead className="text-background text-center font-semibold">Total Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index} className="hover:bg-secondary/30 transition-colors">
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-center">{item.count}</TableCell>
              <TableCell className="text-center">${item.price.toFixed(2)}</TableCell>
              <TableCell className="text-center font-semibold text-primary">${(item.count * item.price).toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-primary/10 font-bold hover:bg-primary/15">
            <TableCell colSpan={3} className="text-right pr-4 font-bold">
              Overall Total
            </TableCell>
            <TableCell className="text-center font-bold text-lg text-primary">${overallTotal.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

/* ==================== Image Dialog ==================== */
const ImageDialog = ({ isOpen, onClose, title, imageUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClose = () => {
    setIsExpanded(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`transition-all duration-500 ${isExpanded ? "max-w-[95vw] max-h-[95vh]" : "max-w-md"}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex justify-center cursor-pointer"
        >
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className={`object-contain transition-all ${
              isExpanded ? "max-h-[75vh]" : "max-h-[200px] hover:scale-105"
            }`}
          />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-2">
          {isExpanded ? "Click image to shrink" : "Click image to expand"}
        </p>
      </DialogContent>
    </Dialog>
  );
};

/* ==================== Edit Dialog ==================== */
const EditDialog = ({ isOpen, onClose, item, onSave }) => {
  const [count, setCount] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (item) {
      setCount(item.count);
      setPrice(item.price);
    }
  }, [item]);

  const handleSave = () => {
    if (item) {
      onSave(item.name, count, price);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit: {item?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Count</Label>
            <Input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </div>
          <div>
            <Label>Price</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ==================== Save Summary Dialog ==================== */
const SaveSummaryDialog = ({ isOpen, onClose, estimationData, onConfirmSave }) => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const billItems = estimationData.filter((i) => i.price > 0);
  const overallTotal = billItems.reduce((sum, item) => sum + item.count * item.price, 0);

  const handleSave = () => {
    if (userDetails.name && userDetails.email) {
      onConfirmSave(userDetails);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            Save Estimation Summary
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Details Section */}
          <div className="border-b pb-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              User Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  placeholder="Enter your name"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  placeholder="Enter your phone"
                  value={userDetails.phone}
                  onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  placeholder="Enter your address"
                  value={userDetails.address}
                  onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Estimation Summary Section */}
          <div className="border-b pb-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Estimation Summary
            </h3>
            <div className="space-y-3">
              {billItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.count} × ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold text-primary">${(item.count * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-2xl font-bold text-primary">${overallTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave}
            disabled={!userDetails.name || !userDetails.email}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Estimation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ==================== Export Report ==================== */
const ExportReport = ({ onExport }) => {
  const [selectedFormat, setSelectedFormat] = useState("pdf");

  const formats = [
    { id: "docx", label: "Word", icon: FileText },
    { id: "xlsx", label: "Excel", icon: FileSpreadsheet },
    { id: "pdf", label: "PDF", icon: File },
  ];

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Export Report</h2>
      <div className="flex gap-3 flex-wrap">
        {formats.map((f) => (
          <Button
            key={f.id}
            variant={selectedFormat === f.id ? "default" : "outline"}
            onClick={() => setSelectedFormat(f.id)}
            className="gap-2"
          >
            <f.icon className="h-4 w-4" /> {f.label}
          </Button>
        ))}
        <Button onClick={() => onExport(selectedFormat)} className="ml-auto gap-2 bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4" /> Download
        </Button>
      </div>
    </div>
  );
};

/* ==================== MAIN COMPONENT ==================== */
const DataModel = ({ apiData }) => {
  const [estimationData, setEstimationData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [saveSummaryOpen, setSaveSummaryOpen] = useState(false);

  // 🔥 Map API data to UI format (exclude "door")
useEffect(() => {
  if (!apiData || !apiData.symbols_per_class) return;

  // Create class -> image map
  const classImageMap = {};
  apiData.classes?.forEach((cls, index) => {
    classImageMap[cls] = apiData.images?.[index];
  });

  const filteredSymbols = Object.entries(apiData.symbols_per_class)
    .filter(([key]) => key.toLowerCase() !== "door")
    .map(([key, value]) => ({
      name: key,
      count: value,
      price: 100,
      imageUrl: classImageMap[key], // 🎯 exact image match
    }));

  const mappedData = [
    {
      name: "Total Symbols",
      count: apiData.total_symbols || 0,
      price: 0,
      imageUrl: apiData.images?.[0],
    },
    ...filteredSymbols,
  ];

  setEstimationData(mappedData);
}, [apiData]);



  const billItems = estimationData.filter((i) => i.price > 0);

  const handleSaveEdit = (name, count, price) => {
    setEstimationData((prev) =>
      prev.map((i) => (i.name === name ? { ...i, count, price } : i))
    );
    toast.success(`${name} updated successfully`);
  };

  const handleConfirmSave = (userDetails) => {
    const billItems = estimationData.filter((i) => i.price > 0);
    const overallTotal = billItems.reduce((sum, item) => sum + item.count * item.price, 0);
    
    const summaryData = {
      user: userDetails,
      items: billItems,
      total: overallTotal,
      date: new Date().toLocaleDateString(),
    };

    toast.success(`Estimation saved for ${userDetails.name}!`);
    console.log("[v0] Saved estimation:", summaryData);
  };

  return (
    <div className="min-h-screen p-6 space-y-10">
      {/* Header with Save Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Estimation System</h1>
          <p className="text-muted-foreground mt-1">View and manage your project estimations</p>
        </div>
        <Button 
          onClick={() => setSaveSummaryOpen(true)}
          className="gap-2 bg-primary hover:bg-primary/90 text-background rounded-lg"
          size="lg"
        >
          <Save className="h-5 w-5" />
          Save Estimation
        </Button>
      </div>

      {/* Estimation Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Estimation Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {estimationData.map((item, i) => (
            <EstimationCard
              key={i}
              {...item}
              onViewImage={() => setSelectedItem(item)}
              onEdit={() => setEditItem(item)}
            />
          ))}
        </div>
      </section>

      {/* Bill Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Bill</h2>
        <BillTable items={billItems} />
      </section>

      {/* Export Report */}
      <ExportReport
        onExport={(format) => toast.success(`Exporting as ${format.toUpperCase()}`)}
      />

      {/* Dialogs */}
      <ImageDialog
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name}
        imageUrl={`http://127.0.0.1:5000${selectedItem?.imageUrl}`}
      />

      <EditDialog
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        item={editItem}
        onSave={handleSaveEdit}
      />

      <SaveSummaryDialog
        isOpen={saveSummaryOpen}
        onClose={() => setSaveSummaryOpen(false)}
        estimationData={estimationData}
        onConfirmSave={handleConfirmSave}
      />
    </div>
  );
};

export default DataModel;
