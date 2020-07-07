using RentApp.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext()
        {
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Reserv> Reservs { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<ClientReserv> ClientsReservs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<ClientReserv>()
                .HasOne(c => c.Client)
                .WithMany(c => c.ClientReservs)
                .HasForeignKey(c => c.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ClientReserv>()
                .HasOne(c => c.Reserv)
                .WithMany(c => c.ClientsReserv)
                .HasForeignKey(c => c.ReservId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
