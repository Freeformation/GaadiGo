import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  GET_TRANSACTION_HISTORY,
  GET_FINANCE_SUMMARY,
} from '../../graphql/operations';
import {
  IndianRupee,
  TrendingUp,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Receipt,
  RefreshCw,
  Wallet,
  Car
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TransactionHistoryView({ onViewVoucher }) {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const {
    data: txnData,
    loading: txnLoading,
    refetch: refetchTxn,
  } = useQuery(GET_TRANSACTION_HISTORY, {
    pollInterval: 5000,
  });

  const {
    data: summaryData,
    loading: summaryLoading,
    refetch: refetchSummary,
  } = useQuery(GET_FINANCE_SUMMARY, {
    pollInterval: 5000,
  });

  const transactions = txnData?.getTransactionHistory || [];
  const summary = summaryData?.getFinanceSummary || {
    totalSpent: 0,
    totalEarned: 0,
    escrowHeld: 0,
    escrowRefunded: 0,
    totalTransactions: 0,
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.transactionId?.toLowerCase().includes(q) ||
        t.vehicleTitle?.toLowerCase().includes(q) ||
        t.vehicleRegistrationNumber?.toLowerCase().includes(q) ||
        t.partyName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const isHost = user?.role === 'HOST';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Financial Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>{isHost ? 'Total Host Earnings Payouts' : 'Total Rental Volume Paid'}</span>
            <IndianRupee className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">
            ₹{(isHost ? summary.totalEarned : summary.totalSpent).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            {isHost ? 'Direct IMPS / UPI net deposits' : 'Settled through UPI & Razorpay'}
          </p>
        </div>

        {/* Metric 2: Escrow in Hold */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Escrow Security Deposits In-Hold</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">
            ₹{summary.escrowHeld.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            RBI Escrow Node: Zero unauthorized deductions
          </p>
        </div>

        {/* Metric 3: Refunds Released */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Total Escrow Refunds Released</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">
            ₹{summary.escrowRefunded.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            Returned to source UPI within 2 hours
          </p>
        </div>

        {/* Metric 4: Transaction Count */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Total Ledger Transactions</span>
            <Receipt className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">
            {summary.totalTransactions}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Verified on Apache Kafka Audit Stream
          </p>
        </div>
      </div>

      {/* Main Ledger Section */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
        {/* Controls Bar: Search & Filter Chips */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          {/* Search by UTR / Vehicle */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by UTR, Vehicle, or Plate..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground shadow-xs"
            />
          </div>

          {/* Filter Chips & Refresh Button */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'All Transactions' },
              { id: 'BOOKING_PAYMENT', label: 'Rental Payments' },
              { id: 'ESCROW_HOLD', label: 'Escrow Holds' },
              { id: 'ESCROW_REFUND', label: 'Refunds' },
              { id: 'HOST_PAYOUT', label: 'Host Payouts' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilterType(chip.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  filterType === chip.id
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {chip.label}
              </button>
            ))}

            <button
              onClick={() => {
                refetchTxn();
                refetchSummary();
              }}
              title="Refresh ledger"
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Transactions Table / List */}
        <div className="mt-6 space-y-3.5">
          {txnLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Loading financial transactions...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 border border-primary/20">
                <Receipt className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-foreground font-display">No Transactions Found</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No financial records match your current filter. When self-drive rides or payouts occur, transaction receipts are recorded here automatically.
              </p>
            </div>
          ) : (
            filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="bg-muted/20 border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition"
              >
                {/* Left: Type Icon + UTR + Vehicle Info */}
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                      t.flow === 'CREDIT'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : t.flow === 'ESCROW_HELD'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {t.flow === 'CREDIT' ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : t.flow === 'ESCROW_HELD' ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-foreground font-display">
                        {t.description}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        {t.paymentMethod?.replace(/_/g, ' ')}
                      </span>
                      {t.status === 'SUCCESS' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Settled
                        </span>
                      ) : t.status === 'HELD_IN_ESCROW' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          In Escrow
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {t.status}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="flex items-center text-foreground font-medium">
                        <Car className="w-3 h-3 mr-1 text-primary" /> {t.vehicleTitle}
                      </span>
                      <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-amber-200 text-slate-900 font-bold border border-amber-300">
                        {t.vehicleRegistrationNumber}
                      </span>
                      <span>•</span>
                      <span>{new Date(t.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      <span>•</span>
                      <span>{t.partyRole}: <strong>{t.partyName}</strong></span>
                    </div>

                    {/* Transaction Reference / UTR */}
                    <div className="mt-1.5 flex items-center space-x-2">
                      <span className="text-[11px] text-muted-foreground font-mono">
                        UTR: <strong className="text-foreground">{t.transactionId}</strong>
                      </span>
                      <button
                        onClick={() => copyToClipboard(t.transactionId, t.id)}
                        title="Copy Banking Reference"
                        className="text-muted-foreground hover:text-primary transition cursor-pointer"
                      >
                        {copiedId === t.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border">
                  <div className="text-left md:text-right">
                    <p
                      className={`text-lg font-black font-display ${
                        t.flow === 'CREDIT'
                          ? 'text-emerald-600'
                          : t.flow === 'ESCROW_HELD'
                          ? 'text-amber-600'
                          : 'text-foreground'
                      }`}
                    >
                      {t.flow === 'CREDIT' ? '+' : t.flow === 'DEBIT' ? '-' : ''}₹
                      {t.amount.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {t.flow === 'ESCROW_HELD' ? 'Escrow Hold' : t.flow}
                    </span>
                  </div>

                  {onViewVoucher && (
                    <button
                      onClick={() =>
                        onViewVoucher({
                          id: t.bookingId,
                          vehicleTitle: t.vehicleTitle,
                          vehicleRegistrationNumber: t.vehicleRegistrationNumber,
                          renterName: t.partyName,
                          paymentTransactionId: t.transactionId,
                          totalAmount: t.amount,
                          securityDeposit: t.amount,
                          paymentStatus: t.status,
                        })
                      }
                      className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted text-[11px] font-bold text-foreground transition flex items-center space-x-1 cursor-pointer shadow-xs"
                    >
                      <Receipt className="w-3 h-3 text-primary" />
                      <span>Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
