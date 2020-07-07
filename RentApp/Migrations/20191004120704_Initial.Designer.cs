﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using RentApp.Data;

namespace RentApp.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20191004120704_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity("RentApp.Models.Client", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Ci");

                    b.Property<int>("CountryId");

                    b.Property<string>("LastName");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.HasIndex("CountryId");

                    b.ToTable("Clients");
                });

            modelBuilder.Entity("RentApp.Models.ClientReserv", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("ClientId");

                    b.Property<string>("Code");

                    b.Property<int>("ReservId");

                    b.HasKey("Id");

                    b.HasIndex("ClientId");

                    b.HasIndex("ReservId");

                    b.ToTable("ClientsReservs");
                });

            modelBuilder.Entity("RentApp.Models.Country", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Countries");
                });

            modelBuilder.Entity("RentApp.Models.Reserv", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CheckIn");

                    b.Property<DateTime>("CheckOut");

                    b.Property<bool?>("Consume");

                    b.Property<float>("FictionalPayment");

                    b.Property<int>("Rating");

                    b.Property<float>("RealPayment");

                    b.Property<string>("ReservationMethod");

                    b.HasKey("Id");

                    b.ToTable("Reservs");
                });

            modelBuilder.Entity("RentApp.Models.Client", b =>
                {
                    b.HasOne("RentApp.Models.Country", "Country")
                        .WithMany()
                        .HasForeignKey("CountryId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("RentApp.Models.ClientReserv", b =>
                {
                    b.HasOne("RentApp.Models.Client", "Client")
                        .WithMany("ClientReservs")
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("RentApp.Models.Reserv", "Reserv")
                        .WithMany("ClientsReserv")
                        .HasForeignKey("ReservId")
                        .OnDelete(DeleteBehavior.Restrict);
                });
#pragma warning restore 612, 618
        }
    }
}
