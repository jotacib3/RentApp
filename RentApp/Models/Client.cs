using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentApp.Models
{
    public class Client : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Ci { get; set; }
        public int CountryId { get; set; }

        public List<ClientReserv> ClientReservs { get; set; }

        public Country Country { get; set; }
    }
}
