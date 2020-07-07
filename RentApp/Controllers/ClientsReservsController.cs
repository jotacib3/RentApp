using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentApp.Data;
using RentApp.Models;

namespace RentApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsReservsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientsReservsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ClientsReservs
        [HttpGet]
        public IEnumerable<ClientReserv> GetClientsReservs()
        {
            return _context.ClientsReservs
                            .Include(c=>c.Client)
                            .ThenInclude(c=>c.Country)
                            .Include(c=>c.Reserv);
        }

        // GET: api/ClientsReservs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClientReserv([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clientReserv = await _context.ClientsReservs.FindAsync(id);

            if (clientReserv == null)
            {
                return NotFound();
            }

            return Ok(clientReserv);
        }

        // PUT: api/ClientsReservs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClientReserv([FromRoute] int id, [FromBody] ClientReserv clientReserv)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != clientReserv.Id)
            {
                return BadRequest();
            }

            _context.Entry(clientReserv).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientReservExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ClientsReservs
        [HttpPost]
        public async Task<IActionResult> PostClientReserv([FromBody] ClientReserv clientReserv)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ClientsReservs.Add(clientReserv);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClientReserv", new { id = clientReserv.Id }, clientReserv);
        }

        // DELETE: api/ClientsReservs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClientReserv([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clientReserv = await _context.ClientsReservs.FindAsync(id);
            if (clientReserv == null)
            {
                return NotFound();
            }

            _context.ClientsReservs.Remove(clientReserv);
            await _context.SaveChangesAsync();

            return Ok(clientReserv);
        }

        private bool ClientReservExists(int id)
        {
            return _context.ClientsReservs.Any(e => e.Id == id);
        }
    }
}